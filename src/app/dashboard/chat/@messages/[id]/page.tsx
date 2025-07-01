import MessageContainer from "@/components/MessageContainer";

const messages = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <MessageContainer chat_id={id} />;
};

export default messages;
