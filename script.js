const playlist = ["SIEmF568kAo", "P4CehWgTBFI", "zXHkrwkjQ10"];
let currentVideo = 0;
let player;
let isPlaying = true;
let isMuted = false;

function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    videoId: playlist[currentVideo],
    playerVars: {
      autoplay: 1,
      mute: 1,
      controls: 0,
      rel: 0,
      fs: 0,
      modestbranding: 1,
      iv_load_policy: 3
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
}

function onPlayerReady() {
  player.playVideo();
  setupControls();
  updateProgressBar();
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    currentVideo = (currentVideo + 1) % playlist.length;
    player.loadVideoById(playlist[currentVideo]);
  }
}

function setupControls() {
  const playPauseBtn = document.getElementById("playPauseBtn");
  const muteBtn = document.getElementById("muteBtn");
  const progressBar = document.getElementById("progressBar");
  const fullscreenBtn = document.getElementById("fullscreenBtn");

  playPauseBtn.addEventListener("click", () => {
    if (isPlaying) {
      player.pauseVideo();
      playPauseBtn.textContent = "▶️";
    } else {
      player.playVideo();
      playPauseBtn.textContent = "⏸";
    }
    isPlaying = !isPlaying;
  });

  muteBtn.addEventListener("click", () => {
    if (isMuted) {
      player.unMute();
      muteBtn.textContent = "🔊";
    } else {
      player.mute();
      muteBtn.textContent = "🔇";
    }
    isMuted = !isMuted;
  });

  progressBar.addEventListener("input", () => {
    const duration = player.getDuration();
    const seekTo = (progressBar.value / 100) * duration;
    player.seekTo(seekTo, true);
  });

  fullscreenBtn.addEventListener("click", () => {
    const container = document.querySelector(".player-container");
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen();
    }
  });
}

function updateProgressBar() {
  const progressBar = document.getElementById("progressBar");
  setInterval(() => {
    if (player && player.getDuration) {
      const currentTime = player.getCurrentTime();
      const duration = player.getDuration();
      if (duration) {
        const progress = (currentTime / duration) * 100;
        progressBar.value = progress;
      }
    }
  }, 1000);
}
