var app = new Vue({
    el: '#app',
    data: {
        volumeGeral: 0.5,
        title: 'Vem me buscar',
        audioPlayers: [],
        duration: 0,
        currentTime: 0,
        folderName: 'audios_examples/output/vem_me_buscar/',
        files: [],
        faixas: [
            {
                id: 1,
                nome: "Baixo",
                src: "bass.wav",
                icon: "img/bassc.svg",
                muted: true,
                color: 'rgba(255, 0, 0, 1)',
                volume: this.volumeGeral,
                solo: true,
            },
            {
                id: 2,
                nome: "Bateria",
                src: "drums.wav",
                icon: "img/drums.svg",
                muted: true,
                color: 'rgba(0, 255, 0, 1)',
                volume: this.volumeGeral,
                solo: true,
            },
            {
                id: 3,
                nome: "Outros",
                src: "other.wav",
                icon: "img/synth.svg",
                muted: true,
                color: 'rgba(0, 0, 200, 1)',
                volume: this.volumeGeral,
                solo: true,
            },
            {
                id: 4,
                nome: "Vocais",
                src: "vocals.wav",
                icon: "img/micxx.svg",
                muted: true,
                color: 'rgba(255, 200, 0, 1)',
                volume: this.volumeGeral,
                solo: true,
            },
            {
                id: 5,
                nome: "Piano",
                src: "piano.wav",
                icon: "img/synth.svg",
                muted: true,
                color: 'rgba(0, 255, 255, 1)',
                volume: this.volumeGeral,
                solo: true,
            }
        ],
        audioPlayers: [],
        duration: 0,
        currentTime: 0,
        firstLoad: true
    },
    mounted() {
        this.audioPlayers = this.$refs.audioPlayers;

        let items = [
            { id: 1, nome: "Vem me buscar", pasta: "vem_me_buscar" },
            // { id: 2, nome: "Love", pasta: "love" },
            // { id: 3, nome: "Morena", pasta: "morena" },
            // { id: 4, nome: "Love Gostosinho", pasta: "love_gostosinho" },
            // { id: 5, nome: "Leão", pasta: "leao" },
        ];

        let file = localStorage.getItem("itemSelecionado")
        if (file) {
            file = JSON.parse(file);
            this.folderName = 'audios_examples/output/' + file.pasta + '/';
            this.title = file.nome;
        } else {
            this.folderName = 'audios_examples/output/vem_me_buscar/';
            this.title = 'Vem me buscar';
        }

        this.files = items;
    },
    methods: {
        setFile(file) {
            if (localStorage.getItem("itemSelecionado")) {
                localStorage.setItem("itemSelecionado", JSON.stringify(file));
            } else {
                localStorage.setItem("itemSelecionado", JSON.stringify(file));
            }

            window.location.reload();
        },
        onAudioLoaded() {
            this.duration = Math.floor(this.audioPlayers[0].duration);
        },
        setMute(ev) {
            const $this = ev.target;
            const faixaId = $this.dataset.id;
            var audio = document.getElementById("audio" + faixaId);
            audio.muted = !audio.muted;
            if (audio.muted) {
                $('#muteButton' + faixaId).addClass('bi-volume-mute').removeClass('bi-volume-up');
            } else {
                $('#muteButton' + faixaId).addClass('bi-volume-up').removeClass('bi-volume-mute');
            }

             this.faixas.map(faixa => {
                if (faixa.id == faixaId) {
                    faixa.solo = true;
                }
            });
        },
        setSolo(ev) {
            const faixaId = ev.target.dataset.id;

            var audioTags = document.getElementsByTagName("audio");

            var audioArray = Array.from(audioTags);

            audioArray.forEach(function (audio) {
                if (audio.dataset.id != faixaId) {
                    audio.muted = true;
                }
                else{
                    audio.muted = false;
                }
            });

            this.faixas.map(faixa => {
                if (faixa.id == faixaId) {
                    faixa.solo = true;
                } else {
                    faixa.solo = false;
                }
            });

        },
        setTime(time) {
            var audioTags = document.getElementsByTagName("audio");
            var audioArray = Array.from(audioTags);
            audioArray.forEach(function (audio) {
                audio.currentTime = time;
            });
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
        play(ev) {
            const me = this;
            var audioTags = document.getElementsByTagName("audio");
            var audioArray = Array.from(audioTags);
            let duration = 0;

            audioArray.forEach(function (audio) {
                duration = audio.duration;
                if (audio.paused) {
                    audio.play();
                    $('#btnPlay').addClass('bi-pause-circle-fill').removeClass('bi-play-circle-fill');
                } else {
                    audio.pause();
                    isPlaying = false;
                    $('#btnPlay').addClass('bi-play-circle-fill').removeClass('bi-pause-circle-fill');
                }
                audio.volume = me.volumeGeral;
            });

            me.duration = duration;

            if (me.firstLoad) {
                var audioTags = document.getElementsByTagName("audio");
                var audioArray = Array.from(audioTags);

                audioArray.forEach(function (audio) {

                    const id = audio.dataset.id;
                    const rgba = audio.dataset.color;

                    // Obter referência para o elemento de áudio e o canvas
                    const canvas = document.getElementById('canvas' + id);
                    // // Configurar o contexto de áudio
                    const audioCtx = new AudioContext();
                    const src = audioCtx.createMediaElementSource(audio);
                    const analyser = audioCtx.createAnalyser();
                    src.connect(analyser);
                    analyser.connect(audioCtx.destination);

                    // Definir configurações de visualização do espectro de áudio
                    analyser.fftSize = 256;
                    const bufferLength = analyser.frequencyBinCount;
                    const dataArray = new Uint8Array(bufferLength);

                    // Configurar o canvas
                    const canvasCtx = canvas.getContext('2d');
                    const WIDTH = canvas.width;
                    const HEIGHT = canvas.height;

                    // Desenhar as ondas sonoras no canvas
                    function draw() {
                        requestAnimationFrame(draw);

                        analyser.getByteFrequencyData(dataArray);

                        canvasCtx.fillStyle = 'rgb(0, 0, 0)';
                        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

                        const barWidth = (WIDTH / bufferLength) * 2.5;
                        let barHeight;
                        let x = 0;

                        for (let i = 0; i < bufferLength; i++) {
                            barHeight = dataArray[i];
                            // (barHeight + 100) +
                            canvasCtx.fillStyle = rgba;
                            canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);

                            x += barWidth + 1;
                        }
                    }
                    draw();

                });

                me.firstLoad = false;
            }
        },
        setMuteGeneral() {
            var audioTags = document.getElementsByTagName("audio");
            var audioArray = Array.from(audioTags);
            audioArray.forEach(function (audio) {
                audio.muted = !audio.muted;
                if (audio.muted) {
                    $('#btnMuteGeneral')
                        .addClass('bi-volume-mute').removeClass('bi-volume-up');
                } else {
                    $('#btnMuteGeneral')
                        .addClass('bi-volume-up').removeClass('bi-volume-mute');
                }
            });
        },
        formatCurrentTime(cTime) {
            let minutes = Math.floor(cTime / 60);
            let seconds = Math.floor(cTime % 60);
            minutes = (minutes >= 10) ? minutes : "0" + minutes;
            seconds = (seconds >= 10) ? seconds : "0" + seconds;
            return minutes + ":" + seconds;
        },
        atualizarTempoGeral(ev) {
            const $this = ev.target;
            let thisDuration = $this.value;
            var audioTags = document.getElementsByTagName("audio");
            var audioArray = Array.from(audioTags);
            audioArray.forEach(function (audio) {
                audio.currentTime = thisDuration;
            });
        },
        updateTime(ev) {
            const audio = document.getElementById("audio1");
            this.currentTime = audio.currentTime
        },
        setVolumeItem(ev) {
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
        skipBackward() {
            var audioTags = document.getElementsByTagName("audio");
            var audioArray = Array.from(audioTags);
            audioArray.forEach(function (audio) {
                audio.currentTime -= 5;
            });
        },
        skipForward() {
            var audioTags = document.getElementsByTagName("audio");
            var audioArray = Array.from(audioTags);
            audioArray.forEach(function (audio) {
                audio.currentTime += 5;
            });
        }
    }
});
