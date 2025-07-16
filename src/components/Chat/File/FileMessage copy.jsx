const FileMessage = ({ message, isCurrentUser }) => {
  const getFileIcon = () => {
    switch (message.fileType) {
      case 'image':
        return (
          <div className="image-preview">
            <img src={message.fileUrl} alt="Shared content" />
          </div>
        );
      case 'file':
        return (
          <a 
            href={message.fileUrl} 
            download={message.originalName}
            className="file-download"
          >
            <span className="file-icon">{getFileExtensionIcon(message.originalName)}</span>
            <span>{message.originalName}</span>
          </a>
        );
      default:
        return null;
    }
  };

  const getFileExtensionIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    switch (ext) {
      case 'pdf': return '📄';
      case 'docx': return '📝';
      case 'txt': return '📋';
      default: return '📁';
    }
  };

  return (
    <div className={`message ${isCurrentUser ? 'current-user' : ''}`}>
      <div className="message-header">
        <span>{message.username}</span>
        <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
      </div>
      <div className="message-content">
        {getFileIcon()}
      </div>
    </div>
  );
};

export default FileMessage;