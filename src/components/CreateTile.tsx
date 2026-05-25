import React, { useEffect, useRef, useState } from "react";
import { MoodType } from "../types";
import { SUGGESTED_UPLOADS } from "../data/mockData";
import { API_BASE_URL } from "./../config";

interface CreateTileProps {
  currentUser: {
    id: string;
  };

  onSave: (data: {
    image_url: string;
    caption: string;
    mood: MoodType;
  }) => void;

  onCancel: () => void;
}

export default function CreateTile({
  currentUser,
  onSave,
  onCancel,
}: CreateTileProps) {
  const [selectedImage, setSelectedImage] =
    useState<string>("");

  const [caption, setCaption] = useState("");

  const [mood, setMood] =
    useState<MoodType>("sun");

  const [error, setError] = useState("");

  const [uploading, setUploading] =
    useState(false);

  const [stream, setStream] =
    useState<MediaStream | null>(null);

  const videoRef =
    useRef<HTMLVideoElement | null>(null);

  const canvasRef =
    useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((track) => {
        track.stop();
      });
    };
  }, [stream]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const selectSuggested = (
    item: typeof SUGGESTED_UPLOADS[0]
  ) => {
    setSelectedImage(item.url);

    setCaption(item.caption);

    setMood(item.mood as MoodType);
  };

  const startCamera = async () => {
    try {
      const mediaStream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
          },
          audio: false,
        });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject =
          mediaStream;
      }
    } catch (error) {
      console.error(error);

      alert("Camera access denied");
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach((track) => {
      track.stop();
    });

    setStream(null);
  };

  const capturePhoto = () => {
    if (
      !videoRef.current ||
      !canvasRef.current
    )
      return;

    const video = videoRef.current;

    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    if (!context) return;

    context.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL(
      "image/jpeg",
      0.8
    );

    setSelectedImage(imageData);

    stopCamera();

    console.log(imageData);
  };

  const dataURLtoFile = async (
    dataurl: string,
    filename: string
  ) => {
    const response = await fetch(dataurl);

    const blob = await response.blob();

    return new File([blob], filename, {
      type: "image/jpeg",
    });
  };

  const handleCreate = async () => {
    try {
      setError("");

      if (!selectedImage) {
        setError(
          "Please select or capture an image."
        );

        return;
      }

      setUploading(true);

      const file = await dataURLtoFile(
        selectedImage,
        "tile.jpg"
      );

      const formData = new FormData();

      formData.append("image", file);

      const uploadResponse = await fetch(
        `${API_BASE_URL}/api/tiles/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadData =
        await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(
          uploadData.error || "Upload failed"
        );
      }

      const tileResponse = await fetch(
        `${API_BASE_URL}/api/tiles`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            userId: currentUser.id,

            imageUrl: uploadData.imageUrl,

            caption,

            moodType: mood,

            dateString: new Date()
              .toISOString()
              .split("T")[0],
          }),
        }
      );

      const tileData =
        await tileResponse.json();

      if (!tileResponse.ok) {
        throw new Error(
          tileData.error ||
            "Failed to create Tile"
        );
      }

      onSave({
        image_url: uploadData.imageUrl,
        caption,
        mood,
      });
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-5 pb-32 pt-4">

      <header className="flex justify-between items-center mb-6">
        <button onClick={onCancel}>
          ✕
        </button>

        <h1 className="text-2xl font-semibold">
          Daily Ritual
        </h1>

        <div />
      </header>

      <section className="mb-6">

        {!selectedImage && !stream && (
          <div className="flex flex-col gap-4">

            <label className="border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <p>Choose from gallery</p>
            </label>

            <button
              onClick={startCamera}
              className="bg-amber-400 rounded-full py-4"
            >
              Open Camera
            </button>
          </div>
        )}

        {stream && (
          <div className="flex flex-col gap-4">

            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="rounded-3xl"
            />

            <button
              onClick={capturePhoto}
              className="bg-black text-white rounded-full py-4"
            >
              Capture
            </button>
          </div>
        )}

        {selectedImage && (
          <div className="relative">

            <img
              src={selectedImage}
              className="rounded-3xl"
            />

            <button
              onClick={() =>
                setSelectedImage("")
              }
              className="absolute top-4 right-4 bg-black/50 text-white rounded-full w-10 h-10"
            >
              ✕
            </button>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className="hidden"
        />
      </section>

      <section className="mb-6">
        <div className="flex gap-3 overflow-x-auto">

          {SUGGESTED_UPLOADS.map(
            (item, idx) => (
              <button
                key={idx}
                onClick={() =>
                  selectSuggested(item)
                }
                className="flex-shrink-0"
              >
                <img
                  src={item.url}
                  className="w-20 h-20 rounded-xl object-cover"
                />
              </button>
            )
          )}
        </div>
      </section>

      <section className="mb-6">
        <textarea
          value={caption}
          onChange={(e) =>
            setCaption(e.target.value)
          }
          placeholder="Write a soft memory..."
          className="w-full rounded-3xl p-5"
          rows={4}
        />
      </section>

      <section className="mb-8 flex gap-3">

        <button
          onClick={() => setMood("heart")}
        >
          ❤️
        </button>

        <button
          onClick={() => setMood("sprout")}
        >
          🌱
        </button>

        <button
          onClick={() => setMood("sun")}
        >
          ☀️
        </button>

        <button
          onClick={() => setMood("zzz")}
        >
          💤
        </button>

      </section>

      {error && (
        <p className="text-red-500 mb-4">
          {error}
        </p>
      )}

      <div className="flex gap-4">

        <button
          onClick={handleCreate}
          disabled={uploading}
          className="bg-amber-500 text-white rounded-full px-8 py-4"
        >
          {uploading
            ? "Saving..."
            : "Save softly"}
        </button>

        <button onClick={onCancel}>
          Cancel
        </button>

      </div>
    </div>
  );
}