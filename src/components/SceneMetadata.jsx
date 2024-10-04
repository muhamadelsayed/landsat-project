const SceneMetadata = ({ metadata }) => {
  return (
    <div>
      <h3>Scene Metadata</h3>
      <p>Satellite: {metadata.satellite}</p>
      <p>Date: {metadata.date}</p>
      <p>Cloud Cover: {metadata.cloudCover}</p>
      <p>WRS Path/Row: {metadata.path}/{metadata.row}</p>
    </div>
  );
};

export default SceneMetadata;