import { useEffect, useRef } from "react";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { Box } from "@mui/material";
import { useState } from "react";
//import { editFoodImage } from "../utils/api";

const UploadWidget = ({ tree_id, photo }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  useEffect(() => {
    console.log(cloudinaryRef.current, widgetRef);

    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: "dymqpmvyq",
        // uploadPreset: "foodcourt",
      },
      function (e, result) {
        if (result.event == "success") {
          console.log(result, tree_id);
          setPreviewImage(result.info.url);
          //   editFoodImage(food_id, result.info.url).then((res) => {
          //     console.log(res);
          //   });
        }
      }
    );
    //console.log(cloudinaryRef.current);
  }, []);

  useEffect(() => {
    if (photo != "" || photo != null) {
      setPreviewImage(photo);
    }
  }, []);
  return (
    <>
      {previewImage ? (
        <Box onClick={() => widgetRef.current.open()}>
          <img src={previewImage} width={128} height={128} />
        </Box>
      ) : (
        <label>
          <Box
            onClick={() => widgetRef.current.open()}
            sx={{
              width: 128,
              height: 128,
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              borderRadius: "5",
              border: "1px dashed grey",
              p: 3,
              borderColor: "#D9D9D9",
              mr: 2,
            }}
          >
            <AddAPhotoIcon />
          </Box>
        </label>
      )}
    </>
  );
};

export default UploadWidget;
