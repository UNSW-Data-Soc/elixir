"use client";

import { CSSProperties, useEffect, useState } from "react";

import { endpoints } from "../api/backend/endpoints";
import { toast } from "react-hot-toast";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Tooltip,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Blog } from "../api/backend/blogs";
import TagReferencesList from "../tags/references/tagReferencesList";
import {
    Attachment,
    AttachmentInfo,
    Detachment,
    TagReferences,
} from "../api/backend/tags";
import BlogCardActions from "./blogCardActions";
import BlogActionsModal from "./blogActionsModal";
import { Spinner } from "../utils";

dayjs.extend(relativeTime);

export default function BlogsList() {
    const session = useSession();
    const router = useRouter();
    const [blogs, setBlogs] = useState<Blog[]>([]);

    const [attachments, setAttachments] = useState<AttachmentInfo[]>([]);
    const [tagReferences, setTagReferences] = useState<TagReferences[]>([]);

    const[loading, setLoading] = useState(true);

    async function getData() {
        let blogsAll: Blog[] = [];
        let references_all: TagReferences[] = [];

        try {
            if (session.status !== "authenticated") {
                [blogsAll, references_all] = await Promise.all([
                    endpoints.blogs.getAll({ authRequired: false }),
                    endpoints.tags.references(false),
                ]);
            } else {
                [blogsAll, references_all] = await Promise.all([
                    endpoints.blogs.getAll({ authRequired: true }),
                    endpoints.tags.references(true),
                ]);
            }
            setBlogs(blogsAll);
            setTagReferences(references_all);
        } catch {
            return toast.error("Failed to retrieve blogs");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getData();
    }, [session.status]);

    async function handleBlogDeletion(id: string) {
        let updatedBlogs: Blog[] = [];
        for (let j of blogs) {
            if (j.id === id) {
                continue;
            }

            updatedBlogs.push(j);
        }

        setBlogs(updatedBlogs);
    }

    async function handleBlogUpdate(updatedBlog: Blog) {
        let updatedBlogs: Blog[] = [];

        for (let j of blogs) {
            if (j.id === updatedBlog.id) {
                updatedBlogs.push({ ...updatedBlog });
            } else {
                updatedBlogs.push(j);
            }
        }

        setBlogs(updatedBlogs);
    }

    async function updateAttachments(
        updatedAttachments: AttachmentInfo[],
        to_attach: Attachment[],
        to_detach: Detachment[]
    ) {
        let updatedTagReferences = updateTagReferencesBlogs(
            tagReferences,
            updatedAttachments,
            to_attach,
            to_detach
        );

        setAttachments(updatedAttachments);
        setTagReferences(updatedTagReferences);
    }

    function updateTagReferencesBlogs(
        currentTagReferences: TagReferences[],
        updatedAttachments: AttachmentInfo[],
        to_attach: Attachment[],
        to_detach: Detachment[]
    ): TagReferences[] {
      let updatedTagReferences: TagReferences[] = [];

      for (let u of currentTagReferences) {
          let new_tag_ref = u;
          for (let d of to_detach) {
              let attachment_info = attachments.find(
                  (a) => a.attachment_id === d.attachment_id
              );
              if (!attachment_info) continue; // shouldn't occur
              if (new_tag_ref.tags_id === attachment_info.tag_id) {
                  new_tag_ref.blog = new_tag_ref.blog.filter(
                      (r) => r[0] !== attachment_info?.bearer_id
                  );
              }
          }
          updatedTagReferences.push(new_tag_ref);
      }

      for (let a of to_attach) {
          for (let u of updatedAttachments) {
              if (a.bearer_id === u.bearer_id && a.tag_id === u.tag_id) {
                  updatedTagReferences.push({
                      tags_id: u.tag_id,
                      tags_name: u.name,
                      tags_colour: u.colour,
                      portfolio: [],
                      blog: [
                        [
                          u.bearer_id,
                          blogs.find((b) => b.id === u.bearer_id)
                              ?.title || "",
                        ],
                      ],
                      event: [],
                      resource: [],
                      job: [],
                  });
              }
          }
      }
  
      return updatedTagReferences;
    }

    function allBlogs() {
        return (
            <>
                <div className="flex items-stretch justify-center align-baseline gap-3 flex-wrap">
                    {
                        blogs.map((b) => (
                            <BlogCard
                                key={b.id}
                                blog={b}
                                handleBlogDeletion={handleBlogDeletion}
                                tagReferences={tagReferences}
                                updateAttachments={updateAttachments}
                                handleBlogUpdate={handleBlogUpdate}
                            />
                        ))
                    }
                </div>
            </>
        );
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center align-baseline gap-3">
                {
                    loading ? <Spinner/> : allBlogs()
                }
                {
                    !loading && blogs.length == 0 &&
                    <div>We will have more blogs coming soon, stay tuned!</div>
                }
            </div>
        </>
    );
}

function BlogCard(props: {
    blog: Blog;
    tagReferences: TagReferences[];
    handleBlogDeletion: (id: string) => void;
    updateAttachments: (
        updatedAttachments: AttachmentInfo[],
        to_attach: Attachment[],
        to_detach: Detachment[]
    ) => void;
    handleBlogUpdate: (updatedBlog: Blog) => void;
}) {
    const [author, setAuthor] = useState("");
    const router = useRouter();

    function getBlogCardStyle(b: Blog): CSSProperties {
        return b.public
            ? {}
            : {
                  opacity: 0.4,
              };
    }

    useEffect(() => {
        async function getDetails() {
            let user = await endpoints.users.get(props.blog.creator);
            setAuthor(user.name);
        }
        
        getDetails();
    }, [props.tagReferences, props.blog]);

    const editedDate = dayjs(Date.parse(props.blog.last_edit_time));

    return (
        <>
            <Card className="py-4 w-96" style={getBlogCardStyle(props.blog)}>
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                    <p className="text-lg font-bold">
                        {props.blog.title}
                    </p>
                    <small className="text-default-500">
                        {author === ""
                            ? "UNSW DataSoc"
                            : `Authored by ${author}`}
                    </small>
                    <Tooltip content={editedDate.format("DD/MM/YYYY HH:mm")}>
                        <small className="text-default-500">
                            {editedDate.fromNow()}
                        </small>
                    </Tooltip>
                </CardHeader>
                <CardBody
                    className="flex items-center justify-center align-baseline overflow-visible py-2 cursor-pointer"
                    onClick={() => {
                        router.push(`/blogs/${props.blog.slug}`);
                    }}
                >
                    {/* TODO: <Image
                      isBlurred
                      src={endpoints.blogs.getBlogPhoto(props.blog.id)}
                      alt='Profile picture'
                      className='object-cover rounded-xl'
                      style={{ cursor: 'pointer' }}
                      height={300}
                      width={300}
                      onClick={() => {
                        setShowcompanyDescription(true);
                      }}
                    /> */}
                    <div
                        className="w-full relative h-[200px]"
                        style={{
                            backgroundImage: `url(/kentosoc.jpeg)`,
                            backgroundOrigin: "content-box",
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                        }}
                    ></div>
                </CardBody>
                <CardFooter>
                    <TagReferencesList
                        styleLarge={false}
                        showEditingTools={false}
                        tagReferences={
                            // only show tags related to this particular blog
                            props.tagReferences.filter(r => {
                                for(let i of r.blog) {
                                    if(i[0] === props.blog.id) {
                                        return true;
                                    }
                                }
                                return false;
                            })
                        }
                    />
                </CardFooter>
                <div className="flex items-center justify-center align-baseline">
                    <BlogCardActions
                        blog={props.blog}
                        updateAttachments={props.updateAttachments}
                    />
                    <BlogActionsModal
                        blog={props.blog}
                        handleDeletion={props.handleBlogDeletion}
                        handleBlogUpdate={props.handleBlogUpdate}
                    />
                </div>
            </Card>
        </>
    );
}
