import React, { useState } from "react";
import background from "../assets/background.jpg";
import Fade from "@mui/material/Fade";

import {
  predictMood,
  getHistory
} from "../services/api";

import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from "@mui/material";


function Home() {

  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [crisisOpen, setCrisisOpen] = useState(false);

const [crisisMessage, setCrisisMessage] = useState("");

  const analyzeMood = async () => {

  if (!text.trim()) {
    alert("Please enter how you're feeling.");
    return;
  }

  setLoading(true);

  try {

    // Get previous mood history
    const historyResponse = await getHistory();

    let moodHistory = historyResponse.data
      .map(item => item.mood_score)
      .filter(
        value =>
          value !== undefined &&
          value !== null
      );

    // Keep only the latest 7 real mood scores
    moodHistory = moodHistory.slice(-7);

    // Send to backend
    // Send to backend
const response = await predictMood({

  text,

  mood_history: moodHistory

});

// Check for crisis response
if (response.data.crisis) {

setCrisisMessage(response.data.message);

setCrisisOpen(true);

setResult(null);

return;

}

// Normal prediction
setResult(response.data);

  } catch (error) {

    console.error(error);

    alert("Unable to connect to the backend.");

  } finally {

    setLoading(false);

  }

};

  return (

    <div
  style={{
    minHeight: "100vh",

    backgroundImage: `linear-gradient(
      rgba(16,24,40,.45),
      rgba(16,24,40,.45)
    ), url(${background})`,

    backgroundSize: "cover",

    backgroundPosition: "center",

    backgroundRepeat: "no-repeat",

    backgroundAttachment: "fixed",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    padding: "40px"
  }}
>

<Container maxWidth="md">

  <Paper
    elevation={0}
    sx={{
      p: 4,
      borderRadius: 5,

    background: "rgba(255,255,255,0.18)",

    backdropFilter: "blur(18px)",

    WebkitBackdropFilter: "blur(18px)",

    border: "1px solid rgba(255,255,255,0.3)",

    boxShadow: "0 8px 32px rgba(31,38,135,0.25)"
  }}
>

        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          gutterBottom
        >
          🧠 AI Mental Health Companion
        </Typography>

        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Tell us how you're feeling today and let AI analyze your emotional state.
        </Typography>

        <TextField
    fullWidth
    multiline
    rows={6}
    label="How are you feeling today?"
    value={text}
    onChange={(e) => setText(e.target.value)}
    variant="outlined"
    sx={{
        mt:2,

        "& .MuiOutlinedInput-root":{

            background:"rgba(255,255,255,0.55)",

            borderRadius:"15px",

            backdropFilter:"blur(8px)"
        }
    }}
/>

        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "center"
          }}
        >

          <Button
  variant="contained"
  size="large"
  onClick={analyzeMood}
  disabled={loading}
  sx={{
    px: 5,
    py: 1.5,
    borderRadius: "30px",
    fontWeight: 600,
    fontSize: "16px",
    boxShadow: "0 8px 20px rgba(25,118,210,.35)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-3px)",
      boxShadow: "0 12px 25px rgba(25,118,210,.45)"
    }
  }}
>
  {loading ? (
    <CircularProgress size={24} color="inherit" />
  ) : (
    "Analyze Mood"
  )}
</Button>

        </Box>

        {loading && (

          <Typography
            align="center"
            sx={{ mt: 3 }}
          >
            ⏳ Running AI models...
          </Typography>

        )}

      </Paper>

      {result && !loading && (

  <Fade in={result !== null} timeout={800}>

    <Card
      elevation={0}
      sx={{
        mt: 5,
        borderRadius: 5,
        background: "rgba(255,255,255,0.18)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: "1px solid rgba(255,255,255,0.3)",
        boxShadow: "0 8px 32px rgba(31,38,135,0.25)"
      }}
    >

      <CardContent>

        <Typography
          variant="h4"
          align="center"
          fontWeight="700"
          color="primary"
        >
          🧠 Analysis Result
        </Typography>

        <Divider
          sx={{
            my: 3,
            borderColor: "rgba(25,118,210,.25)"
          }}
        />

        <Typography
          variant="subtitle1"
          fontWeight="bold"
        >
          📝 Your Text
        </Typography>

        <Typography sx={{ mb: 3 }}>
          {result.text}
        </Typography>

        <Typography
          variant="subtitle1"
          fontWeight="bold"
        >
          😊 Predicted Emotion
        </Typography>

        <Typography sx={{ mb: 2 }}>
          {result.predicted_emotion}
        </Typography>

        <Typography
          variant="subtitle1"
          fontWeight="bold"
        >
          📈 Mood Trend Score
        </Typography>

        <Typography>
          {Number(result.predicted_trend).toFixed(2)}
        </Typography>

      </CardContent>

    </Card>

  </Fade>

)}
<Dialog
    PaperProps={{
        sx:{

            borderRadius:5,

            background:"rgba(255,255,255,.85)",

            backdropFilter:"blur(15px)"
        }
    }}
    open={crisisOpen}
    onClose={() => setCrisisOpen(false)}
    fullWidth
    maxWidth="sm"
>

    <DialogTitle>

        ⚠️ Immediate Support Recommended

    </DialogTitle>

    <DialogContent>

        <Alert severity="warning">

            {crisisMessage}

        </Alert>

    </DialogContent>

    <DialogActions>

        <Button
            variant="contained"
            color="warning"
            onClick={() => setCrisisOpen(false)}
        >
            I Understand
        </Button>

    </DialogActions>

</Dialog>
   </Container>

</div>

);

}

export default Home;