import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Attachment, AttachmentInfo, Bearer, Detachment, Tag } from "./api/backend/tags";
import { endpoints } from "./api/backend/endpoints";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface OptionTag {
    value: Tag;
    label: string;
    isDisabled: boolean;
};

export default function ModifyBearerTags(props: {
    bearer_id: string,
    bearer: Bearer,
    tagLimit?: number,
    initialOptionsFilter?: (a: AttachmentInfo) => boolean,
    updateAttachments?: (updatedAttachments: AttachmentInfo[], to_attach: Attachment[], to_detach: Detachment[]) => void,
}) {
    const router = useRouter();
    const [allTagOptions, setAllTagOptions] = useState<OptionTag[]>([]);
    const [optionsSelected, setOptionsSelected] = useState<OptionTag[]>([]);
    const [attachedDetails, setAttachedDetails] = useState<AttachmentInfo[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    
    
    async function getExistingBearers(): Promise<AttachmentInfo[]> {
        let attachments = await endpoints.tags.attachments(props.bearer, true);
        return attachments;
    }
    
    async function setInitialOptions(tags: Tag[], bearers: AttachmentInfo[]) {
        let options: OptionTag[] = [];
        for(let p of bearers) {
            options.push({
                value: {
                    id: p.tag_id,
                    name: p.colour,
                    colour: p.colour
                },
                label: p.name,
                isDisabled: false,
            })
        }
        
        setOptionsSelected(options);
        
        let allTagOptions: OptionTag[] = [];
        for(let t of tags) {

            // prevent tag from appearing both in pre-selected list as well as dropdown
            let exists = false;
            for(let p of options) {
                if(p.value.id === t.id) {
                    exists = true;
                }
            }
            if(exists) continue;
            
            allTagOptions.push({
                value: t,
                label: t.name,
                isDisabled: false,
            })
        }
        setAllTagOptions(allTagOptions);
    }
    
    useEffect(() => {
        async function getDetails() {
            let [tags, bearers] = await Promise.all([endpoints.tags.getAll(), getExistingBearers()]);

            if(props.initialOptionsFilter) {
                bearers = bearers.filter(props.initialOptionsFilter)
            }
            
            setInitialOptions(tags, bearers);
            setAttachedDetails(bearers);
            setIsLoading(false);
        }
        setIsLoading(true);
        getDetails();
    }, [props.initialOptionsFilter]);

    return (
        <>
            <Select
                isMulti={true}
                isLoading={isLoading}
                isDisabled={isLoading}
                options={allTagOptions}
                isSearchable={true}
                name={props.bearer}
                isOptionSelected={op => {
                    optionsSelected.forEach(o => {
                        if(o.value.id === op.value.id) return true;
                    }
                )
                    return false;
                }}
                value={optionsSelected}
                onChange={async values => {
                    setIsLoading(true);
                    let updatedOptions = [...values];
                    
                    let to_attach: Attachment[] = [];
                    let to_detach: Detachment[] = [];

                    if(props.tagLimit && updatedOptions.length > props.tagLimit) {
                        setIsLoading(false);
                        toast.error(`Only ${props.tagLimit} tag(s) allowed`);
                        return;
                    }

                    for(let ad of attachedDetails) {
                        let exists = false;
                        for(let uo of updatedOptions) {
                            if(ad.tag_id === uo.value.id) {
                                exists = true;
                                break;
                            }
                        }

                        if(!exists) {
                            to_detach.push({
                                detach_from: props.bearer,
                                attachment_id: ad.attachment_id,
                            });
                        }
                    }

                    for(let uo of updatedOptions) {
                        let exists = false;
                        for(let ad of attachedDetails) {
                            if(uo.value.id === ad.tag_id) {
                                exists = true;
                                break;
                            }
                        }

                        if(!exists) {
                            to_attach.push({
                                attach_to: props.bearer,
                                bearer_id: props.bearer_id,
                                tag_id: uo.value.id,
                            })
                        }
                    }

                    
                    await Promise.all(to_detach.map(a => endpoints.tags.detach(a)))
                    let newAttachedDetails = await Promise.all(to_attach.map(a => endpoints.tags.attach(a)))
                    
                    let updatedAttachedDetails: AttachmentInfo[] = attachedDetails.filter(ad => {
                        for(let td of to_detach) {
                            if(td.attachment_id === ad.attachment_id) return false;
                        }
                        return true;
                    })
                    updatedAttachedDetails = updatedAttachedDetails.concat(newAttachedDetails);
                    if(props.updateAttachments) {
                        props.updateAttachments(updatedAttachedDetails, to_attach, to_detach);
                    }
                    setOptionsSelected(updatedOptions)
                    setAttachedDetails(updatedAttachedDetails);
                    setIsLoading(false);
                }}
            />
        </>
    );
}
