const Loading = ({ loading }) => {
  return (
    <>
      {loading && (
        <div className="loading-background">
          <img src="/images/loading.gif" />
        </div>
      )}
    </>
  );
};

export default Loading;
