import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Button,
  CardActions,
} from "@mui/material";
import { motion } from "framer-motion";


export default function JobCard({job_title, associated_skills}) {
  return (
    <motion.div
    whileHover={{
      opacity: 0.8,
      translateY: -2,
    }}
    transition={{
      type: "spring",
      duration: 0.2,
      stiffness: 200,
    }}
    >
    <Card sx={{ maxWidth: 250, border: "2.5px solid black" }}>
      <CardMedia
        sx={{ height: 100, border: "2.5px solid black" }}
        image="/static/images/cards/contemplative-reptile.jpg"
        title={job_title}
      />
      <CardContent sx={{ border: "2.5px solid black" }}>
        <Typography gutterBottom variant="h5" component="div" font="black">
          {job_title}
        </Typography>
        <Box component="div" sx={{ display: "flex", alignItems: "center" }}>
          {/* <List sx={{ padding: 0, margin: "-10px" }}>
            {associated_skills.map((item) => (
              <ListItem key={item.id}>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List> */}
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'center', border: "2.5px solid black"}}> 
        <Button onClick={() => handleClick()} size="small">Learn More</Button>
      </CardActions>
    </Card>
    </motion.div>
  );
}

