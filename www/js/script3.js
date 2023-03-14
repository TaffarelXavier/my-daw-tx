var app = new Vue({
    el: '#app',
    data: {
        volumeGeral: 0.4,
        title: 'Vem me buscar',
        audioPlayers: [],
        duration: 0,
        currentTime: 0,
        folderName: 'audios_examples/output/vem_me_buscar/',
        files: [],
        wavesurfer: null,
        isLoaded: false,
        repeatAB: {
            start: 0,
            end: 0,
            isPlaying: false,
            isLooping: false,
            isRepeating: false,
            isRepeatingAll: false,
            isOpenedModalRepetAB: false,
        },
        wavesurferes: [
            {
                id: 1, instrument: 'Baixo', item: 'bass.wav', wavesurfer: null,
                color: 'lime', progressColor: 'gray', icon: "img/bassc.svg", solo: true, muted: false,
            },
            {
                id: 2, instrument: 'Bateria', item: 'drums.wav', wavesurfer: null,
                color: 'purple', progressColor: 'gray', icon: "img/drums.svg", solo: true, muted: false,
            },
            // {
            //     id: 3, instrument: 'Vocais', item: 'vocals.wav', wavesurfer: null,
            //     color: 'yellow', progressColor: 'gray', icon: "img/synth.svg", solo: true, muted: false,
            // },
            // {
            //     id: 4, instrument: 'Outros', item: 'other.wav', wavesurfer: null,
            //     color: 'red', progressColor: 'gray', icon: "img/micxx.svg", solo: true, muted: false,
            // },
        ],
        waves: []
    },
    mounted() {
        const me = this;

        let items = [
            { id: 1, nome: "Vem me buscar", pasta: "vem_me_buscar" },
            { id: 2, nome: "Love", pasta: "love" },
            { id: 3, nome: "Morena", pasta: "morena" },
            { id: 4, nome: "Love Gostosinho", pasta: "love_gostosinho" },
            { id: 5, nome: "Leão", pasta: "leao" },
        ];

        let file = localStorage.getItem("itemSelecionado");

        if (file) {
            file = JSON.parse(file);
            me.folderName = 'audios_examples/output/' + file.pasta + '/';
            me.title = file.nome;
        } else {
            me.folderName = 'audios_examples/output/vem_me_buscar/';
            me.title = 'Vem me buscar';
        }

        me.files = items;

        me.wavesurferes.forEach((wavesurferObj, index) => {

            const wavesurfer = WaveSurfer.create({
                container: `#waveform-${index}`,
                waveColor: wavesurferObj.color,
                progressColor: wavesurferObj.progressColor,
                height: 50,
                responsive: true,
                cursorColor: null,
                // hideCursor: index == me.wavesurferes.length - 1 ? 1 : 0,
                // cursorWidth: index == me.wavesurferes.length - 1 ? 1 : 0,
                hideCursor: false,
                cursorWidth: 1,
                interact: false,
                plugins: [
                    WaveSurfer.regions.create()
                ]
            });

            wavesurfer.load(me.folderName + wavesurferObj.item);

            wavesurfer.setVolume(me.volumeGeral);

            wavesurferObj.wavesurfer = wavesurfer;

            wavesurfer.on('audioprocess', function (currentTime) {
                const position = wavesurfer.getCurrentTime() / wavesurfer.getDuration() * 100;
                me.currentTime = wavesurfer.getCurrentTime();
                $('#range').val(position);
            });

            wavesurfer.on('ready', function (ev) {
                me.duration = wavesurfer.getDuration();
                if (wavesurfer.getDuration()) {
                    me.isLoaded = true;
                }
            });

        });
    },
    methods: {
        loop() {
            this.wavesurferes.forEach((wavesurferObj, index) => {
                wavesurferObj.wavesurfer.clearRegions();
                var myRegion = wavesurferObj.wavesurfer.addRegion({
                    start: 0,
                    end: this.duration,
                    color: 'rgba(255, 0, 0, 0.1)',
                    drag: false,
                    resize: true
                });
                myRegion.playLoop();
                myRegion.on('update', function () {
                    myRegion.play();
                })
            })
        },
        formatCurrentTime(cTime) {
            let minutes = Math.floor(cTime / 60);
            let seconds = Math.floor(cTime % 60);
            minutes = (minutes >= 10) ? minutes : "0" + minutes;
            seconds = (seconds >= 10) ? seconds : "0" + seconds;
            return minutes + ":" + seconds;
        },
        backward() {
            this.wavesurfer.skipBackward(15);
        },
        play() {
            this.wavesurfer.play();
        },
        pause() {
            this.wavesurfer.pause();
        },
        forward() {
            this.wavesurfer.skipForward(15);
        },
        toggleMute() {
            this.wavesurfer.toggleMute();
        },
        setVolumeAll(ev) {
            const $this = ev.target;
            const vol = $this.value;
            this.wavesurferes.forEach((wavesurferObj) => {
                wavesurferObj.wavesurfer.setVolume(vol);
            });
        },
        setMuteAll() {
            let isMuted = false;
            this.wavesurferes.forEach((wavesurferObj) => {
                isMuted = wavesurferObj.wavesurfer.getMute();
                wavesurferObj.wavesurfer.toggleMute();
            });

            if (!isMuted) {
                $('#btnMuteGeneral')
                    .addClass('bi-volume-mute').removeClass('bi-volume-up');
            } else {
                $('#btnMuteGeneral')
                    .addClass('bi-volume-up').removeClass('bi-volume-mute');
            }
        },
        toggleMuteAll() {
            this.wavesurferes.forEach((wavesurferObj) => {
                wavesurferObj.wavesurfer.toggleMute();
            });
        },
        backwardAll() {
            this.wavesurferes.forEach((wavesurferObj) => {
                wavesurferObj.wavesurfer.skipBackward(5);
            });
        },
        forwardAll() {
            this.wavesurferes.forEach((wavesurferObj) => {
                wavesurferObj.wavesurfer.skipForward(5);
            });
        },
        stopAll() {
            this.wavesurferes.forEach((wavesurferObj) => {
                wavesurferObj.wavesurfer.stop();
                wavesurferObj.wavesurfer.seekTo(0);
                wavesurferObj.wavesurfer.clearRegions();
            });
            this.currentTime = 0;
            $('#range').val(0);
            $('#btnPlay').addClass('bi-play-circle-fill').removeClass('bi-pause-circle-fill');
        },
        pauseAll() {
            this.wavesurferes.forEach((wavesurferObj) => {
                wavesurferObj.wavesurfer.pause();
            });
        },
        playAll() {
            let isPlaying = false;
            this.wavesurferes.forEach((wavesurferObj) => {
                isPlaying = wavesurferObj.wavesurfer.isPlaying();
                wavesurferObj.wavesurfer.playPause();
            });
            if (isPlaying) {
                $('#btnPlay').addClass('bi-play-circle-fill').removeClass('bi-pause-circle-fill');
            }
            else {
                $('#btnPlay').addClass('bi-pause-circle-fill').removeClass('bi-play-circle-fill');
            }
        },
        atualizarTempoGeral(ev) {
            const $slider = ev.target;
            const position = $slider.value / 100;
            this.currentTime = position * this.duration;
            this.wavesurferes.forEach((wavesurferObj) => {
                wavesurferObj.wavesurfer.seekTo(position);
            });
        },
        setFile(file) {
            if (localStorage.getItem("itemSelecionado")) {
                localStorage.setItem("itemSelecionado", JSON.stringify(file));
            } else {
                localStorage.setItem("itemSelecionado", JSON.stringify(file));
            }

            window.location.reload();
        },
        setVolumeItem(ev) {
            const $this = ev.target;
            const vol = $this.value;
            const myId = $this.dataset.id;
            this.wavesurferes[$this.id].wavesurfer.setVolume(vol);
            this.wavesurferes[$this.id].wavesurfer.setMute(false);
           $('#muteButton' + myId).addClass('bi-volume-up').removeClass('bi-volume-mute');
        },
        setMute(index) {
            this.wavesurferes[index].wavesurfer.toggleMute();
            if (this.wavesurferes[index].wavesurfer.getMute()) {
                $('#muteButton' + (index + 1)).addClass('bi-volume-mute').removeClass('bi-volume-up');
            } else {
                this.wavesurferes[index].solo = true;
                $('#muteButton' + (index + 1)).addClass('bi-volume-up').removeClass('bi-volume-mute');
            }

        },
        setSolo(ev) {
            const faixaId = ev.target.dataset.id;

            this.wavesurferes.forEach((wavesurferObj, index) => {
                if (index == faixaId) {
                    wavesurferObj.solo = true;
                    wavesurferObj.muted = false;
                    wavesurferObj.wavesurfer.setMute(false);
                }
                else {
                    wavesurferObj.solo = false;
                    wavesurferObj.muted = true;
                    wavesurferObj.wavesurfer.setMute(true);
                }
            });
        },
        abrirModalRepetirAB() {
            this.repeatAB.isOpenedModalRepetAB = !this.repeatAB.isOpenedModalRepetAB;
        },
        setRepeatA() {
            this.repeatAB.start = this.currentTime;
        },
        setRepeatB() {
            const me = this;

            me.repeatAB.end = me.currentTime;

            me.wavesurferes.forEach((wavesurferObj, index) => {
                var myRegion = wavesurferObj.wavesurfer.addRegion({
                    start: me.repeatAB.start,
                    end:  me.repeatAB.end,
                    color: 'rgba(255, 0, 0, 0.1)',
                    drag: true,
                    resize: true
                });
                myRegion.playLoop();
            });
        }
    }
})
