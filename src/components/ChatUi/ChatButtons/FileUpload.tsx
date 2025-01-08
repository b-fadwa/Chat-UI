import { useRef } from 'react';
import { MdOutlineFileUpload } from 'react-icons/md';

const FileUpload = () => {
  const fileInputRef = useRef<any>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Selected file:', file.name);
    }
  };

  return (
    <div>
      <input
        type="file"
        className="hidden bg-red-500 p-4"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <button onClick={handleButtonClick}>
        <MdOutlineFileUpload />
      </button>
    </div>
  );
};
export default FileUpload;
