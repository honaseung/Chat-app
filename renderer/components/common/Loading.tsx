/**
 *
 * @description api 요청 또는 필요시에 로딩 상태를 이미지로 보여주는 컴포넌트입니다.
 */
const Loading: React.FunctionComponent = () => {
  return (
    <>
      <div className="loading-background">
        <img src="/common/loading.gif" />
      </div>
    </>
  );
};

export default Loading;
