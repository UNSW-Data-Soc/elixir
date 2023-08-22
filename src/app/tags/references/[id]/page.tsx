"use client";

import { endpoints } from "@/app/api/backend/endpoints";
import { Bearer, TagReferences } from "@/app/api/backend/tags";
import {Tabs, Tab, Card, CardBody, Button} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface Tab {
    id: Bearer,
    label: string
}

export default function TagsInfo({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [references, setReferences] = useState<TagReferences>();
    const [activeTab, setActiveTab] = useState<Bearer>();
    const [refTabs, setRefTabs] = useState<Tab[]>([]);
    const [numReferences, setNumReferences] = useState(0);

    useEffect(() => {
        async function getReferences() {
            let refs = (await endpoints.tags.references()).find(t => t.tags_id === params.id);
            if(!refs) {
                toast.error("Tag does not exist");
                router.push("/");
                return;
            }
            setReferences(refs);
            let tabs: Tab[] = [];
            let numRef = 0;
            if(refs.portfolio.length > 0) {numRef += refs.portfolio.length; tabs.push({id: "portfolio", label: "Portfolios"})};
            if(refs.job.length > 0) {numRef += refs.job.length; tabs.push({id: "blog", label: "Blogs"})};
            if(refs.event.length > 0) {numRef += refs.event.length; tabs.push({id: "event", label: "Events"})};
            if(refs.resource.length > 0) {numRef += refs.resource.length; tabs.push({id: "resource", label: "Resources"})};
            if(refs.sponsorship.length > 0) {numRef += refs.sponsorship.length; tabs.push({id: "sponsorship", label: "Sponsorships"})};
            if(refs.job.length > 0) {numRef += refs.job.length; tabs.push({id: "job", label: "Jobs"})};
            setRefTabs(tabs);
            setNumReferences(numRef);

            if(tabs.length > 0) {
                setActiveTab(tabs[0].id);
            }
        }
        
        getReferences();
    }, []);
    
    function handleCardPress(id: string) {
        if(activeTab === "portfolio") {
            // router.push("/users")
        } else if(activeTab === "blog") {
            // TODO: suffix with slug
            // router.push("/blog/")
        } else if(activeTab === "event") {
            
        } else if(activeTab === "resource") {
            
        } else if(activeTab === "sponsorship") {
            
        } else if(activeTab === "job") {
            
        }
    }

    return (
        <>{
            references &&
            <div className="flex flex-col items-center justify-center align-baseline mt-10 gap-5">
            <div style={{backgroundColor: references.tags_colour}} className="flex flex-col items-center justify-center align-baseline outline p-3 w-full">
                <p className="text-3xl font-semibold">{references.tags_name}</p>
                <p className="italic text-1xl">{numReferences} references found</p>
            </div>
            {
               numReferences > 0 ?
                (   
                <>
                    <div className="flex w-full flex-col items-center justify-center align-baseline">
                        <Tabs aria-label="Dynamic tabs" items={refTabs} selectedKey={activeTab} onSelectionChange={(e) => {
                            // should be safe since keys can only store Bearer types
                            setActiveTab(e.toString() as Bearer);
                        }}>
                            {(item) => (
                                <Tab key={item.id} title={item.label}/>
                            )}
                        </Tabs>
                    </div>
                    {
                    activeTab && references[activeTab].map(r => {
                        return <div>
                            <Card
                                key={r[0]}
                                onPress={() => handleCardPress(r[0])}
                                style={{cursor: "pointer"}}
                                isBlurred={true}
                                className="mt-5"
                            >
                                <CardBody>
                                    <p>{r[1]}</p>
                                </CardBody>
                            </Card>
                        </div>
                    })}
                </>
                )
                :
                <div className="italic">No references found.</div>
            }
            </div>
        }
        </>
    );
}
