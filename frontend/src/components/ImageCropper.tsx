import { useEffect, useRef, useState, type SyntheticEvent } from 'react';

import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from 'react-image-crop';

import type { FileWithPreview } from '@/types/file.types';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LoadingSwap } from '@/components/ui/loading-swap';

import 'react-image-crop/dist/ReactCrop.css';

const ASPECT_RATIO = 1;

type ImageCropperProps = {
  children: React.ReactNode;
  onCropFinish: (blob: Blob) => Promise<void>;
};

const ImageCropper = ({ onCropFinish, children }: ImageCropperProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);

  useEffect(() => {
    return () => {
      if (selectedFile) {
        URL.revokeObjectURL(selectedFile.preview);
      }
    };
  }, [selectedFile]);

  const resetState = () => {
    setCrop(undefined);
    setCompletedCrop(null);
    setIsSubmitting(false);

    if (selectedFile) {
      URL.revokeObjectURL(selectedFile.preview);
    }

    setSelectedFile(null);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleOpenChange = (open: boolean) => {
    if (open && !selectedFile) {
      openFilePicker();
      return;
    }

    setIsOpen(open);

    if (!open) {
      resetState();
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileWithPreview: FileWithPreview = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });

    setSelectedFile(fileWithPreview);
    setIsOpen(true);

    e.target.value = '';
  };

  const onImageLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, ASPECT_RATIO));
  };

  const onCropComplete = (crop: PixelCrop) => {
    setCompletedCrop(crop.width && crop.height ? crop : null);
  };

  const getCroppedImg = async (image: HTMLImageElement, crop: PixelCrop) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.imageSmoothingEnabled = false;

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY,
      );
    }

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (file) => {
          if (file) {
            resolve(file);
          } else {
            reject(new Error('Failed to create image blob'));
          }
        },
        'image/png',
        1.0,
      );
    });

    return blob;
  };

  const onCrop = async () => {
    if (isSubmitting) return;

    try {
      if (!imgRef.current || !completedCrop?.width || !completedCrop?.height)
        return;

      setIsSubmitting(true);
      const blob = await getCroppedImg(imgRef.current, completedCrop);
      await onCropFinish(blob);
      handleOpenChange(false);
    } catch (error) {
      console.error('Crop failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={onFileChange}
      />

      <DialogTrigger render={<span className="contents">{children}</span>} />

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>

        <ReactCrop
          crop={crop}
          circularCrop
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => void onCropComplete(c)}
          aspect={ASPECT_RATIO}
        >
          {selectedFile && (
            <img
              ref={imgRef}
              src={selectedFile.preview}
              alt="Source"
              onLoad={onImageLoad}
              className="w-full"
            />
          )}
        </ReactCrop>

        <DialogFooter>
          <DialogClose
            onClick={() => handleOpenChange(false)}
            render={
              <Button variant="ghost" type="reset">
                Cancel
              </Button>
            }
          />
          <Button
            type="submit"
            onClick={onCrop}
            disabled={!completedCrop || isSubmitting}
          >
            <LoadingSwap isLoading={isSubmitting}>Crop</LoadingSwap>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropper;

const centerAspectCrop = (
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
): Crop => {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 50,
        height: 50,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
};
