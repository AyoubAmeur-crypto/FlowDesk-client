import { useCallback } from "react";
import Talk from "talkjs";
import { Session, Chatbox } from "@talkjs/react";
import useAuthStore from "../globalState/zustand";

export default function ChatComponent({ currentUser, otherUser }) {
    const userData = useAuthStore((state)=>state.userData)
  const syncUser = useCallback(
    () =>
      new Talk.User({
        id: String(userData.userId),
        name: userData.firstName+' '+userData.lastName,
        email: userData.userEmail,
        role: "default",
      }),
    [currentUser]
  );

  const syncConversation = useCallback(
    (session) => {
      const conversation = session.getOrCreateConversation(
        Talk.oneOnOneId(currentUser, otherUser)
      );
      conversation.setParticipant(session.me);
      conversation.setParticipant(new Talk.User(otherUser));
      return conversation;
    },
    [currentUser, otherUser]
  );

  return (
    <Session appId="tNd6D1rn" syncUser={syncUser}>
      <Chatbox
        syncConversation={syncConversation}
        style={{ width: "100%", height: "500px" }}
      />
    </Session>
  );
}