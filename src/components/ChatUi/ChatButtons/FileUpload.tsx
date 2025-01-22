import { useRef } from 'react';
import { MdOutlineFileUpload } from 'react-icons/md';

const FileUpload = ({ handleFileUpload }: { handleFileUpload: (file: File) => void }) => {
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
      handleFileUpload(file);
      console.log(file.name);
    }
  };

  return (
    <div>
      <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
      <button onClick={handleButtonClick} className="p-4 rounded bg-gray-100">
        <MdOutlineFileUpload className='text-xl'/>
      </button>
    </div>
  );
};
export default FileUpload;
