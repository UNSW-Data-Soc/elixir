// "use client";

// import { Button } from "@nextui-org/button";
// import { Company } from "../api/backend/companies";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
// import {
//   Modal,
//   ModalBody,
//   ModalContent,
//   ModalFooter,
//   ModalHeader,
// } from "@nextui-org/modal";
// import { Job } from "../api/backend/jobs";
// import ModifyBearerTags from "../modifyBearerTags";
// import { Attachment, AttachmentInfo, Detachment } from "../api/backend/tags";

// export default function JobActions(props: {
//   job: Job;
//   company: Company;
//   updateAttachments: (
//     updatedAttachments: AttachmentInfo[],
//     to_attach: Attachment[],
//     to_detach: Detachment[],
//   ) => void;
// }) {
//   const [showModifyTagsDialogue, setShowModifyTagsDialogue] = useState(false);

//   const session = useSession();
//   const router = useRouter();

//   if (session.status !== "authenticated" || !session.data.user.moderator) {
//     return <></>;
//   }

//   return (
//     <>
//       <Modal
//         isOpen={showModifyTagsDialogue}
//         onOpenChange={() => setShowModifyTagsDialogue(false)}
//         className="h-96"
//       >
//         <ModalContent>
//           {(onClose) => (
//             <>
//               <ModalHeader className="flex flex-col gap-1">
//                 Edit tags
//                 <small className="text-default-500">
//                   Add or remove tags from this job
//                 </small>
//               </ModalHeader>
//               <ModalBody>
//                 <ModifyBearerTags
//                   bearer="job"
//                   bearer_id={props.job.id}
//                   initialOptionsFilter={(ai) => ai.bearer_id === props.job.id}
//                   updateAttachments={props.updateAttachments}
//                 />
//               </ModalBody>
//               <ModalFooter>
//                 <Button color="success" variant="light" onPress={onClose}>
//                   Done
//                 </Button>
//               </ModalFooter>
//             </>
//           )}
//         </ModalContent>
//       </Modal>

//       <div className="m-3 flex items-center justify-between gap-5 align-baseline">
//         <Button
//           color="warning"
//           radius="full"
//           variant="light"
//           onClick={() => {
//             setShowModifyTagsDialogue(true);
//           }}
//         >
//           Edit Tags
//         </Button>
//       </div>
//     </>
//   );
// }
