"use client";

import { endpoints } from "@/app/api/backend/endpoints";
import { Bearer, Tag, TagReferences, tags } from "@/app/api/backend/tags";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import {
  Button,
  Divider,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
  Tab,
  Tabs,
} from "@nextui-org/react";
import { CSSProperties, useEffect, useState } from "react";
import toast from "react-hot-toast";
import TagActions from "./tagActions";
import TagAddCard from "../tagAddCard";
import { useSession } from "next-auth/react";

interface Tab {
  id: Bearer;
  label: string;
}

export default function TagReferencesList({
  styleLarge,
  showEditingTools,
  tagReferences,
  getSmallTagStyle = getSmallTagStyleDefault,
}: {
  styleLarge: boolean;
  showEditingTools: boolean;
  tagReferences?: TagReferences[];
  getSmallTagStyle?: (tag_colour: string) => CSSProperties;
}) {
  const session = useSession();
  const [references, setReferences] = useState<TagReferences[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openRef, setOpenRef] = useState<TagReferences>();

  useEffect(() => {
    async function getReferences() {
      let refs: TagReferences[] = [];

      if (tagReferences) {
        refs = tagReferences;
      } else {
        if (session.status === "authenticated") {
          refs = await endpoints.tags.references(true);
        } else {
          refs = await endpoints.tags.references(false);
        }
        if (!refs) {
          toast.error("Failed to load tag references");
          return;
        }
      }

      setReferences(refs);
    }
    getReferences();
  }, [session.status, tagReferences]);

  async function handleTagUpdate(updatedTagReference: TagReferences) {
    let updatedReferences = [];
    for (let r of references) {
      if (r.tags_id === updatedTagReference.tags_id) {
        updatedReferences.push(updatedTagReference);
        continue;
      }
      updatedReferences.push(r);
    }

    setIsModalOpen(false);
    setOpenRef(undefined);
    setReferences(updatedReferences);
  }

  async function deleteTag(id: string) {
    let updatedReferences = references.filter((r) => r.tags_id !== id);
    setIsModalOpen(false);
    setOpenRef(undefined);
    setReferences(updatedReferences);
  }

  async function handleTagCreation(tag: Tag) {
    let updatedReferences = [...references];

    // new tag has 0 references
    updatedReferences.push({
      tags_id: tag.id,
      tags_name: tag.name,
      tags_colour: tag.colour,
      portfolio: [],
      blog: [],
      event: [],
      resource: [],
      job: [],
    });

    setReferences(updatedReferences);
  }

  async function handleTagClick(tagReference: TagReferences) {
    setOpenRef(tagReference);
    setIsModalOpen(true);
  }

  return (
    <>
      {showEditingTools && <TagAddCard handleTagCreation={handleTagCreation} />}
      <div className="flex flex-wrap items-center justify-center gap-2 align-baseline">
        {references.map((r) => {
          return styleLarge ? (
            <Card
              key={r.tags_id}
              isBlurred
              isPressable
              radius="lg"
              className="border-none"
              onPress={() => handleTagClick(r)}
            >
              <CardHeader className="flex-col items-start px-4 pb-0 pt-2">
                <h4 className="text-large font-bold">{r.tags_name}</h4>
                <small className="text-default-500">
                  {getNumReferences(r)} references
                </small>
              </CardHeader>
              <CardBody className="overflow-visible py-2"></CardBody>
              <CardFooter style={{ backgroundColor: r.tags_colour }} />
            </Card>
          ) : (
            <>
              <div key={r.tags_id}>
                <div
                  style={getSmallTagStyle(r.tags_colour)}
                  onClick={() => handleTagClick(r)}
                >
                  {r.tags_name}
                </div>
              </div>
            </>
          );
        })}
      </div>
      {isModalOpen && openRef !== undefined && (
        <TagInfoModal
          isOpen={isModalOpen}
          onOpenChange={() => {
            setOpenRef(undefined);
            setIsModalOpen(false);
          }}
          showEditingTools={showEditingTools}
          reference={openRef}
          handleTagDeletion={deleteTag}
          handleTagUpdate={handleTagUpdate}
        />
      )}
    </>
  );
}

function TagInfoModal(props: {
  isOpen: boolean;
  onOpenChange: () => void;
  showEditingTools: boolean;
  reference: TagReferences;
  handleTagDeletion: (id: string) => void;
  handleTagUpdate: (updatedTagReference: TagReferences) => void;
}) {
  const [activeTab, setActiveTab] = useState<Bearer>("resource");
  const [showTagActionsModal, setShowTagActionsModal] = useState(false);

  return (
    <>
      <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {props.reference.tags_name}
                <small className="text-default-500">
                  {getNumReferences(props.reference)} references found
                </small>
              </ModalHeader>
              <Divider />
              <ModalBody>
                <div className="flex w-full flex-col items-center justify-center align-baseline">
                  <Tabs
                    aria-label="Dynamic tabs"
                    items={getTabs(props.reference)}
                    selectedKey={activeTab}
                    onSelectionChange={(e) => {
                      // should be safe since keys can only store Bearer types
                      setActiveTab(e.toString() as Bearer);
                    }}
                  >
                    {(item) => <Tab key={item.id} title={item.label} />}
                  </Tabs>
                  <div className="item-center m-3 flex flex-row flex-wrap justify-center gap-3 align-baseline">
                    <ScrollShadow className="h-[400px] p-9">
                      {activeTab &&
                        props.reference[activeTab].map((r) => (
                          <>
                            <div
                              key={r[0]}
                              color="default"
                              className="item-center flex max-w-xs flex-row flex-wrap justify-center p-3 align-baseline"
                            >
                              {r[1]}
                            </div>
                            <Divider />
                          </>
                        ))}
                    </ScrollShadow>
                  </div>
                </div>
                <Divider />
                {props.showEditingTools && showTagActionsModal && (
                  <DisplayTagActionsModal
                    isOpen={true}
                    onOpenChange={() => {
                      setShowTagActionsModal(false);
                    }}
                    reference={props.reference}
                    handleTagDeletion={props.handleTagDeletion}
                    handleTagUpdate={props.handleTagUpdate}
                  />
                )}
              </ModalBody>
              <ModalFooter className="flex items-center justify-between align-baseline">
                <Link href="/tags/references">
                  <Button color="secondary" variant="light">
                    See all tags
                  </Button>
                </Link>
                {props.showEditingTools && (
                  <Button
                    color="default"
                    variant="light"
                    onPress={() => setShowTagActionsModal(true)}
                  >
                    Edit
                  </Button>
                )}
                <Button color="primary" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

function DisplayTagActionsModal(props: {
  isOpen: boolean;
  onOpenChange: () => void;
  reference: TagReferences;
  handleTagDeletion: (id: string) => void;
  handleTagUpdate: (updatedTagReference: TagReferences) => void;
}) {
  return (
    <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Edit Tag</ModalHeader>
            <ModalBody>
              <TagActions
                numRefences={getNumReferences(props.reference)}
                tagReference={props.reference}
                handleTagDeletion={props.handleTagDeletion}
                handleTagUpdate={props.handleTagUpdate}
              />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

function getNumReferences(references: TagReferences) {
  return (
    references.portfolio.length +
    references.blog.length +
    references.event.length +
    references.resource.length +
    references.job.length
  );
}

function getTabs(references: TagReferences) {
  let tabs: Tab[] = [];
  let numRef = 0;
  if (references.portfolio.length > 0) {
    numRef += references.portfolio.length;
    tabs.push({ id: "portfolio", label: "Portfolios" });
  }
  if (references.blog.length > 0) {
    numRef += references.blog.length;
    tabs.push({ id: "blog", label: "Blogs" });
  }
  if (references.event.length > 0) {
    numRef += references.event.length;
    tabs.push({ id: "event", label: "Events" });
  }
  if (references.resource.length > 0) {
    numRef += references.resource.length;
    tabs.push({ id: "resource", label: "Resources" });
  }
  if (references.job.length > 0) {
    numRef += references.job.length;
    tabs.push({ id: "job", label: "Jobs" });
  }
  return tabs;
}

function getSmallTagStyleDefault(tag_colour: string): CSSProperties {
  return {
    backgroundColor: tag_colour,
    color: "#ffffff",
    padding: "5px 10px",
    borderRadius: "4px",
    margin: "5px",
    display: "inline-block",
    whiteSpace: "nowrap",
    width: "auto",
    fontSize: "12px", // Adjust the font size as needed
    cursor: "pointer",
    position: "relative",
    // Explicitly set the background color
    background: tag_colour,
  };
}
