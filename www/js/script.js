var app = new Vue({
    el: '#app',
    data: {
        volumeGeral: 0.5,
        audioPlayers: [],
        duration: 0,
        currentTime: 0,
        faixas: [{
            id: 1,
            nome: "Baixo",
            src: "audio_example/audio_example-bass.mp3",
            icon: "./bassc.svg",
            muted: true,
            color: 'rgba(255, 0, 0, 1)',
            volume: 1
        },
        {
            id: 2,
            nome: "Bateria",
            src: "audio_example/audio_example-drums.mp3",
            icon: "./drums.svg",
            muted: true,
            color: 'rgba(0, 255, 0, 1)',
            volume: 1
        },
        {
            id: 3,
            nome: "Outros",
            src: "audio_example/audio_example-other.mp3",
            icon: "./synth.svg",
            muted: true,
            color: 'rgba(0, 0, 200, 1)',
            volume: 1
        },
        {
            id: 4,
            nome: "Vocais",
            src: "audio_example/audio_example-vocals.mp3",
            icon: "./micxx.svg",
            muted: true,
            color: 'rgba(255, 200, 0, 1)',
            volume: 1
        }
        ]
    },
    mounted() {
        // const me = this;

        this.audioPlayers = this.$refs.audioPlayers;

        // var audioTags = document.getElementsByTagName("audio");
        // var audioArray = Array.from(audioTags);

        // audioArray.forEach(function (audio) {

        //     const id = audio.dataset.id;
        //     const rgba = audio.dataset.color;

        //     // Obter referência para o elemento de áudio e o canvas
        //     const canvas = document.getElementById('canvas' + id);
        //     // // Configurar o contexto de áudio
        //     const audioCtx = new AudioContext();
        //     const src = audioCtx.createMediaElementSource(audio);
        //     const analyser = audioCtx.createAnalyser();
        //     src.connect(analyser);
        //     analyser.connect(audioCtx.destination);

        //     // Definir configurações de visualização do espectro de áudio
        //     analyser.fftSize = 256;
        //     const bufferLength = analyser.frequencyBinCount;
        //     const dataArray = new Uint8Array(bufferLength);

        //     // Configurar o canvas
        //     const canvasCtx = canvas.getContext('2d');
        //     const WIDTH = canvas.width;
        //     const HEIGHT = canvas.height;

        //     // Desenhar as ondas sonoras no canvas
        //     function draw() {
        //         requestAnimationFrame(draw);

        //         analyser.getByteFrequencyData(dataArray);

        //         canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        //         canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        //         const barWidth = (WIDTH / bufferLength) * 2.5;
        //         let barHeight;
        //         let x = 0;

        //         for (let i = 0; i < bufferLength; i++) {
        //             barHeight = dataArray[i];
        //             // (barHeight + 100) +
        //             canvasCtx.fillStyle = rgba;
        //             canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);

        //             x += barWidth + 1;
        //         }
        //     }
        //     draw();
        // });
    },
    methods: {
        formatCurrentTime(cTime) {
            let minutes = Math.floor(cTime / 60);
            let seconds = Math.floor(cTime % 60);
            minutes = (minutes >= 10) ? minutes : "0" + minutes;
            seconds = (seconds >= 10) ? seconds : "0" + seconds;
            return minutes + ":" + seconds;
        },
        mudo(ev) {
            const $this = ev.target;
            const faixaId = $this.dataset.id;
            var audio = document.getElementById("audio" + faixaId);
            audio.muted = !audio.muted;
            if (audio.muted) {
                $('#muteButton' + faixaId).addClass('bi-volume-mute').removeClass('bi-volume-up');
            } else {
                $('#muteButton' + faixaId).addClass('bi-volume-up').removeClass('bi-volume-mute');
            }
        },
        alterarVolume(ev) {
            const $this = ev.target;
            const vol = $this.value;
            const audio1 = document.getElementById("audio" + $this.id);
            audio1.volume = vol;
            this.faixas.find(function (faixa) {
                if (faixa.id == $this.id) {
                    faixa.volume = vol;
                }
            });
        },
        play(ev) {
            const me = this;
            var audioTags = document.getElementsByTagName("audio");
            var audioArray = Array.from(audioTags);
            let duration = 0;
            audioArray.forEach(function (audio) {
                duration = audio.duration;
                if (audio.paused) {
                    audio.play();
                    $('#btnPlay').html('<i class="bi bi-pause-circle-fill"></i>');
                } else {
                    audio.pause();
                    isPlaying = false;
                    $('#btnPlay').html('<i class="bi bi-play-circle-fill"></i>');
                }
                audio.volume = me.volumeGeral;
            });

            me.duration = duration;
        },
        alterarVolumeGeral(ev) {
            const $this = ev.target;
            const vol = $this.value;
            var audioTags = document.getElementsByTagName("audio");
            var audioArray = Array.from(audioTags);
            audioArray.forEach(function (audio) {
                audio.volume = vol;
            });
            this.faixas.forEach(function (faixa) {
                faixa.volume = vol;
            })
        },
        setDuration() {
        },
        updateTime(ev) {
            const $this = ev.target;
            this.currentTime = $this.currentTime;
        },
        setMuteGeneral() {
            var audioTags = document.getElementsByTagName("audio");
            var audioArray = Array.from(audioTags);
            audioArray.forEach(function (audio) {
                audio.muted = !audio.muted;
                if (audio.muted) {
                    $('#btnMuteGeneral').html('<i class="bi bi-volume-mute"></i>');
                } else {
                    $('#btnMuteGeneral').html('<i class="bi bi-volume-up"></i>');
                }
            });
        },
        atualizarTempoGeral(ev) {
            // const $this = ev.target;
            // let thisDuration = $this.value;
            // var audioTags = document.getElementsByTagName("audio");
            // var audioArray = Array.from(audioTags);
            // audioArray.forEach(function (audio) {
            //     audio.pause();
            //     audio.currentTime = thisDuration;
            //     // setInterval(() => {
            //     //     audio.play();
            //     // }, 100);
            // });
        },
        onAudioLoaded() {
            this.duration = Math.floor(this.audioPlayers[0].duration);
        },
        onTimeInput() {
            for (let i = 0; i < this.audioPlayers.length; i++) {
                const audio = this.audioPlayers[i];
                audio.currentTime = this.currentTime;
                if (audio.paused) {
                    audio.play();
                }
            }
        }
    }
})
