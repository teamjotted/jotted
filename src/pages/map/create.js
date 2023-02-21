import Header from "@/components/Header";
import { createNode, createTree } from "@/utils/api";
import {
  Box,
  CssBaseline,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import Carousel from "react-material-ui-carousel";
import { media } from "../../mock/TreePhotos";
export const DISCIPLINE_DATA_ARRAY = [
  "Art & Culture",
  "Geography & places",
  "Health & fitness",
  "History & events",
  "Mathematics & abstractions",
  "Natural sciences & nature",
  "Philosophy & thinking",
  "Religion & spirituality",
  "Social sciences & society",
  "Technology & applied sciences",
  "Other",
];

export default function Create() {
  const { data: session } = useSession();
  const router = useRouter();
  const [treePhoto, setTreePhoto] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  function createTreeHandler() {
    const tree = {
      name: name,
      description: description,
      user_id: session.user.id,
      category: category,
      tags: "",
      photo: treePhoto,
    };
    createTree(tree).then((res) => {
      console.log(res);
      const newNode = {
        label: name,
        photo: treePhoto,
        type: "mainNode",
        tree_id: res.id,
        position: {
          x: 100,
          y: 100,
        },
        data: {
          label: name,
          position: {
            x: 100,
            y: 100,
          },
        },
        index: 0,
      };
      console.log(newNode);
      createNode(newNode).then((res) => {
        console.log(res);
      });

      router.push(`/map/${res.id}`);
    });
  }
  function photoHandler(e) {
    const photo = media[e];
    setTreePhoto(photo.photo);
  }
  return (
    <Box
      sx={{ backgroundColor: "#F2F1F6", height: "100%", minHeight: "100vh" }}
    >
      <Head>
        <title>Create a New Map</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <CssBaseline />
      <>
        <Box
          sx={{
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
            display: "flex",
          }}
        >
          <Box sx={{ width: 600 }}>
            <Typography sx={{ fontWeight: 700 }}>Create New Map</Typography>
            <TextField
              sx={{ backgroundColor: "white", my: 1 }}
              placeholder="Title"
              fullWidth
              size="small"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <TextField
              placeholder="Description"
              sx={{ backgroundColor: "white", my: 1 }}
              fullWidth
              multiline
              rows={3}
              size="small"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
            <Box sx={{ p: 1 }}>
              <Carousel
                onChange={photoHandler}
                navButtonsAlwaysVisible={true}
                indicators={false}
                cycleNavigation={false}
                height={200}
                autoPlay={false}
              >
                {media.map((item, i) => (
                  <Box
                    sx={{ justifyContent: "center", display: "flex" }}
                    key={i}
                  >
                    <Box
                      sx={{ justifyContent: "center" }}
                      component={"img"}
                      width={200}
                      height={200}
                      src={item.photo}
                    />
                  </Box>
                ))}
                {/* <Box>{media[0].name}</Box> */}
              </Carousel>
            </Box>
            <FormControl
              sx={{ my: 2, backgroundColor: "white" }}
              size="small"
              fullWidth
            >
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
              >
                {DISCIPLINE_DATA_ARRAY.map((res) => (
                  <MenuItem value={res}>{res}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box
              onClick={createTreeHandler}
              sx={{
                cursor: "pointer",
                "&:hover": {
                  opacity: 0.2,
                },
                borderRadius: 2,
                display: "flex",
                boxShadow: 0,
                backgroundColor: "white",

                justifyContent: "center",
                alignItems: "center",
                height: 40,
                border: 1,
                borderColor: "#D1D5DB",
              }}
            >
              <Typography sx={{ fontWeight: 600, color: "#374151", px: 2 }}>
                Save
              </Typography>
            </Box>
          </Box>
        </Box>
      </>
    </Box>
  );
}
