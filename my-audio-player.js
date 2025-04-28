function AudioPlayer(container) {
    this.container = container;
    this.playButton = container.find(".btn-play");
    this.pauseButton = container.find(".btn-pause");
    this.stopButton = container.find(".btn-stop");
    this.rewindButton = container.find(".btn-rewind");
    this.forwardButton = container.find(".btn-forward");
    this.volumeMuteButton = container.find(".btn-volume-mute");
    this.volumeUpButton = container.find(".btn-volume-up");
    this.volumeDownButton = container.find(".btn-volume-down");
    this.progressBar = container.find(".progress .bar");
    this.timeDisplay = container.find(".progress .time");
    this.songElements = container.find("ul.audio-list li");
    this.currentSongIndex = 0;
    this.songs = [];
    this.progressTimer = null;

    this.init();
}

AudioPlayer.prototype.init = function () {
    var self = this;

    this.songElements.each(function () {
        var el = $(this);
        var song = {
            src: el.data("src"),
            title: el.data("title"),
            type: el.data("type"),
            audio: null
        };
        self.songs.push(song);
    });

    if (this.songs.length > 0) {
        this.loadSong(this.currentSongIndex);
    }

    this.playButton.on("click touchstart", function (e) {
        e.preventDefault();
        self.playCurrentSong();
    });

    this.pauseButton.on("click touchstart", function (e) {
        e.preventDefault();
        self.pauseCurrentSong();
    });

    this.stopButton.on("click touchstart", function (e) {
        e.preventDefault();
        self.stopCurrentSong();
    });

    this.rewindButton.on("click touchstart", function (e) {
        e.preventDefault();
        self.rewindCurrentSong();
    });

    this.forwardButton.on("click touchstart", function (e) {
        e.preventDefault();
        self.forwardCurrentSong();
    });

    this.volumeMuteButton.on("click touchstart", function (e) {
        e.preventDefault();
        self.muteCurrentSong();
    });

    this.volumeUpButton.on("click touchstart", function (e) {
        e.preventDefault();
        self.changeVolume(0.1);
    });

    this.volumeDownButton.on("click touchstart", function (e) {
        e.preventDefault();
        self.changeVolume(-0.1);
    });
};

AudioPlayer.prototype.loadSong = function (index) {
    var song = this.songs[index];
    if (!song.audio) {
        song.audio = new Audio(song.src);
        song.audio.preload = "auto";
        song.audio.addEventListener("ended", this.onSongEnded.bind(this));
    }
};

AudioPlayer.prototype.getCurrentSong = function () {
    return this.songs[this.currentSongIndex];
};

AudioPlayer.prototype.playCurrentSong = function () {
    var song = this.getCurrentSong();
    if (song.audio) {
        song.audio.play();
        this.playButton.hide();
        this.pauseButton.show();
        this.startProgress();
    }
};

AudioPlayer.prototype.pauseCurrentSong = function () {
    var song = this.getCurrentSong();
    if (song.audio) {
        song.audio.pause();
        this.pauseButton.hide();
        this.playButton.show();
        this.stopProgress();
    }
};

AudioPlayer.prototype.stopCurrentSong = function () {
    var song = this.getCurrentSong();
    if (song.audio) {
        song.audio.pause();
        song.audio.currentTime = 0;
        this.pauseButton.hide();
        this.playButton.show();
        this.updateProgress(0, song.audio.duration || 0);
        this.stopProgress();
    }
};

AudioPlayer.prototype.rewindCurrentSong = function () {
    var song = this.getCurrentSong();
    if (song.audio) {
        song.audio.currentTime = Math.max(0, song.audio.currentTime - 15);
    }
};

AudioPlayer.prototype.forwardCurrentSong = function () {
    var song = this.getCurrentSong();
    if (song.audio) {
        song.audio.currentTime = Math.min(song.audio.duration, song.audio.currentTime + 15);
    }
};

AudioPlayer.prototype.muteCurrentSong = function () {
    var song = this.getCurrentSong();
    if (song.audio) {
        song.audio.muted = !song.audio.muted;
    }
};

AudioPlayer.prototype.changeVolume = function (delta) {
    var song = this.getCurrentSong();
    if (song.audio) {
        var newVolume = song.audio.volume + delta;
        newVolume = Math.max(0, Math.min(1, newVolume));
        song.audio.volume = newVolume;
    }
};

AudioPlayer.prototype.startProgress = function () {
    var self = this;
    this.stopProgress();
    this.progressTimer = setInterval(function () {
        var song = self.getCurrentSong();
        if (song.audio) {
            self.updateProgress(song.audio.currentTime, song.audio.duration);
        }
    }, 300);
};

AudioPlayer.prototype.stopProgress = function () {
    if (this.progressTimer) {
        clearInterval(this.progressTimer);
        this.progressTimer = null;
    }
};

AudioPlayer.prototype.updateProgress = function (currentTime, duration) {
    if (!duration) duration = 0;
    var percentage = duration > 0 ? (currentTime / duration) * 100 : 0;
    this.progressBar.css("width", percentage + "%");
    this.timeDisplay.text(this.formatTime(currentTime) + " / " + this.formatTime(duration));
};

AudioPlayer.prototype.formatTime = function (time) {
    var minutes = Math.floor(time / 60);
    var seconds = Math.floor(time % 60);
    if (seconds < 10) seconds = "0" + seconds;
    return minutes + ":" + seconds;
};

AudioPlayer.prototype.onSongEnded = function () {
    this.pauseButton.hide();
    this.playButton.show();
    this.updateProgress(0, 0);
    this.stopProgress();
};

// Initialize
$(document).ready(function () {
    $(".audio-player").each(function () {
        new AudioPlayer($(this));
    });
});
