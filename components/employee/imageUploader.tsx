import React from 'react';
import { IKContext, IKImage, IKUpload } from 'imagekitio-react';
import { url } from 'inspector';

export type ImageUploaderType = {
  role?: string;
  photo?: string;
  empId: number;
  uploadImage: (id: number, fileName: string) => void;
};
const ImageUploader = (paramType: ImageUploaderType) => {
  let { empId, photo, role, uploadImage } = paramType;
  const fileInputRef = React.createRef<HTMLDivElement>();
  const urlEndpoint = 'https://ik.imagekit.io/at4uyufqd9s';
  const publicKey = 'public_s/7hMS5caDc8ei20lSX8qSVKghE=';
  const authenticationEndpoint = 'https://spbu.vercel.app/api/auth';

  const onSelectImageError = (err: any) => {
    console.log('Error', err);
  }

  const onSelectImageSuccess = (res: any) => {
    //console.log('SUCCESS:', res.filePath);
    //setImagePreview(res.filePath);
    uploadImage(empId, res.filePath);
  };

  const selectImage = () => {
    const f = fileInputRef && fileInputRef.current;
    if (f) {
      const t = f?.querySelector(`#file-upload-${empId}`) as HTMLInputElement;
      t && t.click();
    }
  };
  return (
    <div ref={fileInputRef}>
      <IKContext
        publicKey={publicKey}
        urlEndpoint={urlEndpoint}
        transformationPosition="path"
        authenticationEndpoint={authenticationEndpoint}>
        <IKImage
          style={{
            cursor: 'pointer',
            border: '1px solid teal',
            borderRadius: '0.3rem',
            padding: '0.1rem',
            margin: '-0.1rem',
          }}
          onClick={() =>
            (role === 'Admin' || role === 'Owner') && selectImage()
          }
          path={photo}
          urlEndpoint={'https://ik.imagekit.io/at4uyufqd9s'}
          folder={'/spbu'}
          transformation={[
            {
              width: '140',
              height: '191',
            },
          ]}
        />
        <IKUpload
          id={`file-upload-${empId}`}
          style={{ display: 'none' }}
          isPrivateFile={false}
          folder={'/spbu'}
          fileName="image.jpg"
          onError={onSelectImageError}
          onSuccess={onSelectImageSuccess}
        />
      </IKContext>
    </div>
  );
};

export default ImageUploader;
