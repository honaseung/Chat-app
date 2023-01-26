const Loading = ({ loading }) => {
  return (
    <>
      {loading && (
        <div>
          <img src="/images/loading.gif" />
          <img src="/images/chat-logo.png" />
        </div>
      )}
    </>
  );
};

export default Loading;
