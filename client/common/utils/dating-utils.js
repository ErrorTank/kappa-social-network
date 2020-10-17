const getReceiveFromChatBox = (chatBox, ownerId) => {
  return chatBox.user1._id === ownerId
    ? chatBox.user2
    : chatBox.user2._id === ownerId
    ? chatBox.user1
    : null;
};
export { getReceiveFromChatBox };
