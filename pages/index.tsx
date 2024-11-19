import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  TextField,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import ViewListIcon from "@mui/icons-material/ViewList";
import GridViewIcon from "@mui/icons-material/GridView";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";

type UploadedAudio = {
  id: number;
  file: File;
  name: string;
  url: string;
};

const AudioUploader: React.FC = () => {
  const [audioFiles, setAudioFiles] = useState<UploadedAudio[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"card" | "grid">("card");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newName, setNewName] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    const validFiles: UploadedAudio[] = [];
    Array.from(files).forEach((file, index) => {
      if (file.type.startsWith("audio/")) {
        validFiles.push({
          id: Date.now() + index,
          file,
          name: file.name,
          url: URL.createObjectURL(file),
        });
      } else {
        alert(`${file.name} is not a valid audio file.`);
      }
    });
    setAudioFiles((prev) => [...prev, ...validFiles]);
  };

  const handlePlay = (index: number) => {
    if (audioRef.current && audioFiles[index]) {
      try {
        console.log("Playing:", audioFiles[index].url);
        audioRef.current.src = audioFiles[index].url;
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        setCurrentSongIndex(index);
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    }
  };

  const handleNext = () => {
    if (currentSongIndex !== null && currentSongIndex < audioFiles.length - 1) {
      handlePlay(currentSongIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSongIndex !== null && currentSongIndex > 0) {
      handlePlay(currentSongIndex - 1);
    }
  };

  const handleAudioEnd = () => {
    handleNext();
  };

  const handleViewToggle = (
    event: React.MouseEvent<HTMLElement>,
    newView: "card" | "grid" | null
  ) => {
    if (newView !== null) setViewMode(newView);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setNewName(audioFiles[index].name);
  };

  const handleSave = (index: number) => {
    const updatedAudioFiles = [...audioFiles];
    updatedAudioFiles[index].name = newName;
    setAudioFiles(updatedAudioFiles);
    setEditingIndex(null);
  };

  return (
    <Container
      maxWidth="md"
      sx={{ mt: 5, marginTop: "98px", fontFamily: "cursive" }}
    >
      <Typography
        variant="h4"
        textAlign="center"
        gutterBottom
        sx={{ fontFamily: "sans-serif" }}
      >
        Upload your Audio and Play
      </Typography>

      <Box
        border="2px dashed gray"
        borderRadius={2}
        p={3}
        textAlign="center"
        sx={{ mb: 3, cursor: "pointer" }}
      >
        <Typography variant="body1" sx={{ color: "grey" }}>
          Drag & Drop Audio Files Here
        </Typography>
        <Typography variant="body2">or</Typography>
        <Button
          variant="contained"
          startIcon={<UploadFileIcon />}
          component="label"
          sx={{
            background: "linear-gradient(135deg, #ff4e50, #f9d423)",
            borderRadius: "26px",
            padding: "8px 20px",
            fontSize: "16px",
            fontWeight: "bold",
            textTransform: "none",
            transition: "background 0.3s, transform 0.2s",
            "&:hover": {
              background: "linear-gradient(135deg, #ff4e50, #f9d423)",
              transform: "scale(1.05)",
            },
            "&:active": {
              transform: "scale(1)",
            },
          }}
        >
          Upload Audio
          <input
            hidden
            type="file"
            accept="audio/*"
            multiple
            onChange={(e) => handleFileUpload(e.target.files)}
          />
        </Button>
      </Box>

      <ToggleButtonGroup
        value={viewMode}
        exclusive
        onChange={handleViewToggle}
        aria-label="view mode"
        sx={{ mb: 3 }}
      >
        <ToggleButton value="card" aria-label="card view">
          <ViewListIcon />
        </ToggleButton>
        <ToggleButton value="grid" aria-label="grid view">
          <GridViewIcon />
        </ToggleButton>
      </ToggleButtonGroup>

      <Box sx={{ mb: 3 }}>
        {viewMode === "card" ? (
          audioFiles.map((audio, index) => (
            <Card
              key={audio.id}
              sx={{
                display: "flex",

                mb: 2,
                border: currentSongIndex === index ? "2px solid green" : "",
                boxShadow:
                  " 0px 4px 10px rgba(0, 114, 255, 0.3), 0px 2px 6px rgba(0, 198, 255, 0.3)",

              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <CardContent sx={{ flex: "1 0 auto" }}>
                  {editingIndex === index ? (
                    <TextField
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onBlur={() => handleSave(index)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSave(index);
                      }}
                      variant="outlined"
                      size="small"
                      fullWidth
                    />
                  ) : (
                    <Typography component="div" sx={{ fontSize: "15px" }}>
                      {audio.name}
                    </Typography>
                  )}
                  <Button
                    variant="outlined"
                    onClick={() => handlePlay(index)}
                    startIcon={<PlayArrowIcon />}
                    sx={{
                      background: "linear-gradient(135deg, #ff4e50, #f9d423)",
                      borderRadius: "26px",
                      padding: "8px 25px",
                      fontSize: "16px",
                      color: "white",
                      fontWeight: "bold",
                      textTransform: "none",
                      marginTop: "5px",
                      transition: "background 0.3s, transform 0.2s",
                      boxShadow: "0 4px 8px rgba(252, 40, 3, 0.7)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #8c1401, #db1c07)",
                        transform: "scale(1.05)",
                      },
                      "&:active": {
                        transform: "scale(1)",
                      },
                    }}
                  >
                    Play
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => handleEdit(index)}
                    sx={{
                      background: "linear-gradient(135deg, #ff4e50, #f9d423)",
                      borderRadius: "26px",
                      padding: "8px 25px",
                      fontSize: "16px",
                      color: "white",
                      fontWeight: "bold",
                      textTransform: "none",
                      marginTop: 1,
                      transition: "background 0.3s, transform 0.2s",
                      boxShadow: "0 4px 8px rgba(252, 40, 3, 0.7)",
                      marginLeft: "5px",
                    }}
                  >
                    Edit Name
                  </Button>
                </CardContent>
              </Box>
              <CardMedia
                component="img"
                sx={{
                  width: "100px",
                  height: "100px",
                  marginTop: "10px",
                  marginRight: "10px",
                }}
                image="data:image/jpeg;base64,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"
                alt="music icon"
              />
            </Card>
          ))
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {audioFiles.map((audio, index) => (
              <Grid item key={audio.id} xs={12} sm={6} md={4}>
                <Card
                  key={audio.id}
                  sx={{
                    display: "flex",

                    flexDirection: "column",

                    boxShadow: "0 8px 24px rgba(252, 40, 3, 0.7)",
                    border:
                      currentSongIndex === index
                        ? "2px solid #4CAF50"
                        : "1px solid #ddd",
                    borderRadius: "16px",
                    overflow: "hidden",
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderTopLeftRadius: "16px",
                      borderTopRightRadius: "16px",
                    }}
                    image="data:image/jpeg;base64,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"
                    alt="music icon"
                  />

                  <Box
                    sx={{ display: "flex", flexDirection: "column", flex: 1 }}
                  >
                    <CardContent sx={{ flex: "1 0 auto", padding: "16px" }}>
                      {editingIndex === index ? (
                        <TextField
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          onBlur={() => handleSave(index)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSave(index);
                          }}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ marginBottom: "16px" }}
                        />
                      ) : (
                        <Typography
                          component="div"
                          sx={{
                            fontSize: "16px",
                            fontWeight: 500,
                            color: "text.primary",
                            lineHeight: 1.5,
                            marginBottom: "12px",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {audio.name}
                        </Typography>
                      )}

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        <Button
                          variant="contained"
                          onClick={() => handlePlay(index)}
                          startIcon={<PlayArrowIcon />}
                          sx={{
                            background:
                              "linear-gradient(135deg, #ff4e50, #f9d423)",
                            borderRadius: "26px",
                            padding: "10px 20px",
                            fontSize: "16px",
                            color: "white",
                            fontWeight: "bold",
                            textTransform: "none",
                            boxShadow:
                              " 0px 4px 10px rgba(0, 114, 255, 0.3), 0px 2px 6px rgba(0, 198, 255, 0.3)",
                            transition: "background 0.3s, transform 0.2s",
                            "&:hover": {
                              background:
                                "linear-gradient(135deg, #8c1401, #db1c07)",
                              transform: "scale(1.05)",
                            },
                            "&:active": {
                              transform: "scale(1)",
                            },
                          }}
                        >
                          Play
                        </Button>

                        <Button
                          variant="outlined"
                          onClick={() => handleEdit(index)}
                          sx={{
                            background:
                              "linear-gradient(135deg, #ff4e50, #f9d423)",
                            borderRadius: "26px",
                            padding: "8px 15px",
                            fontSize: "16px",
                            color: "white",
                            fontWeight: "bold",
                            textTransform: "none",
                            boxShadow: "0 4px 8px rgba(252, 40, 3, 0.7)",
                            marginTop: 1,
                            transition: "background 0.3s, transform 0.2s",
                          }}
                        >
                          Edit Name
                        </Button>
                      </Box>
                    </CardContent>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <audio
        ref={audioRef}
        onEnded={handleAudioEnd}
        controls
        style={{ width: "100%", marginTop: "20px" }}
      />
    </Container>
  );
};

export default AudioUploader;
