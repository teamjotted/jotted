import { useEffect, useRef } from "react";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { Box } from "@mui/material";
import { useState } from "react";
//import { editFoodImage } from "../utils/api";

const UploadWidget = ({ tree_id, photo, setEditedTree, setEditMode }) => {
  const [imageSrc, setImageSrc] = useState();
  const [uploadData, setUploadData] = useState();

  function handleOnChange(changeEvent) {
    const reader = new FileReader();

    reader.onload = function (onLoadEvent) {
      setImageSrc(onLoadEvent.target.result);
      setUploadData(undefined);
    };

    reader.readAsDataURL(changeEvent.target.files[0]);
  }
  async function handleOnSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;

    const fileInput = Array.from(form.elements).find(
      ({ name }) => name === "file"
    );

    const formData = new FormData();

    for (const file of fileInput.files) {
      formData.append("file", file);
    }
    formData.append("upload_preset", "maps-thumbnail");

    const data = await fetch(
      "https://api.cloudinary.com/v1_1/dymqpmvyq/image/upload/",
      {
        method: "POST",
        body: formData,
      }
    ).then((r) => r.json());
    console.log("data", data);
    setImageSrc(data.secure_url);
    setEditedTree({ photo: data.secure_url });
    setUploadData(data);
    setEditMode(false);
  }
  return (
    <form method="post" onChange={handleOnChange} onSubmit={handleOnSubmit}>
      <p>
        <input type="file" name="file" />
      </p>
      <img width={imageSrc ? 300 : 0} src={imageSrc} />
      {imageSrc && !uploadData && (
        <p>
          <button style={{ color: "red" }}>Upload Photo!</button>
        </p>
      )}
      {/* {uploadData && (
        // <code>
        //   <pre>{JSON.stringify(uploadData, null, 2)}</pre>
        // </code>
        // <>Uplaoded</>
      )} */}
    </form>
  );
};

export default UploadWidget;
