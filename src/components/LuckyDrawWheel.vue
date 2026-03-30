<template>
  <div ref="fullscreenContainer" class="lucky-draw">
    <div class="mall-bg mall-bg-left"></div>
    <div class="mall-bg mall-bg-right"></div>
    <div class="mall-spotlight mall-spotlight-left"></div>
    <div class="mall-spotlight mall-spotlight-right"></div>
    <div class="mall-stage"></div>
    <div class="mall-marquee mall-marquee-top"></div>
    <div class="mall-marquee mall-marquee-bottom"></div>

    <button class="fullscreen-button" @click="toggleFullscreen">
      {{ isFullscreen ? '退出全屏' : '全屏显示' }}
    </button>

    <h2 class="lucky-title">幸运大抽奖</h2>

    <div class="wheel-stage">
      <div class="pointer"></div>
      <canvas ref="wheelCanvas" class="wheel"></canvas>
    </div>

    <button
      class="control-button"
      :disabled="!hasRemainingPrizes && !spinning"
      @click="toggleSpin"
    >
      {{ spinning ? '停止抽奖' : '开始抽奖' }}
    </button>

    <p class="status-text">剩余奖品：{{ remainingPrizeCount }} 份</p>

    <div v-if="result" class="confetti-layer" aria-hidden="true">
      <span
        v-for="piece in confettiPieces"
        :key="piece.id"
        class="confetti-piece"
        :style="piece.style"
      ></span>
    </div>

    <div v-if="result" class="result-mask" @click.self="closePopup">
      <div class="result-popup">
        <p>恭喜你抽中了：{{ result }}</p>
        <button @click="closePopup">关闭</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LuckyDrawWheel',
  data() {
    return {
      prizes: [
        { name: '黄油小熊', count: 1 },
        { name: '笔袋', count: 1 },
        { name: '橡皮', count: 3 },
        { name: '盲袋', count: 2 },
        { name: '熊猫钥匙扣', count: 1 },
        { name: '磁性书签', count: 3 },
        { name: '拼图', count: 1 },
        { name: '糖果', count: 5 },
        { name: '饼干', count: 4 }
      ],
      wheelColors: ['#fff3d6', '#f7c7a8', '#8fd3c7', '#9fc7f8', '#ffe08a', '#efb0a1', '#cde7b0', '#ffd7b8', '#f6c667'],
      spinning: false,
      result: null,
      confettiPieces: [],
      rotation: 0,
      spinTimer: null,
      isFullscreen: false
    };
  },
  computed: {
    remainingPrizeCount() {
      return this.prizes.reduce(function(total, prize) {
        return total + prize.count;
      }, 0);
    },
    hasRemainingPrizes() {
      return this.remainingPrizeCount > 0;
    }
  },
  mounted() {
    this.drawWheel();
    document.addEventListener('fullscreenchange', this.syncFullscreenState);
  },
  beforeDestroy() {
    this.clearSpinTimer();
    document.removeEventListener('fullscreenchange', this.syncFullscreenState);
  },
  methods: {
    getNormalizedRotation() {
      return ((this.rotation % 360) + 360) % 360;
    },
    getSelectedIndexFromRotation() {
      const totalPrizes = this.prizes.length;
      const arc = 360 / totalPrizes;
      const pointerAngle = 270;
      const selectedAngle = ((pointerAngle - this.getNormalizedRotation()) + 360) % 360;

      return Math.floor((selectedAngle + 0.0001) / arc) % totalPrizes;
    },
    getNextAvailableIndex(startIndex) {
      const totalPrizes = this.prizes.length;
      let selectedIndex = startIndex;

      while (this.prizes[selectedIndex].count === 0) {
        selectedIndex = (selectedIndex + 1) % totalPrizes;
      }

      return selectedIndex;
    },
    alignWheelToPrize(selectedIndex) {
      const totalPrizes = this.prizes.length;
      const arc = 360 / totalPrizes;
      const pointerAngle = 270;
      const targetCenterAngle = (selectedIndex * arc) + (arc / 2);
      const targetNormalizedRotation = ((pointerAngle - targetCenterAngle) + 360) % 360;
      const currentTurns = Math.floor(this.rotation / 360);
      let nextRotation = (currentTurns * 360) + targetNormalizedRotation;

      if (nextRotation < this.rotation) {
        nextRotation += 360;
      }

      this.rotation = nextRotation;
      if (this.$refs.wheelCanvas) {
        this.$refs.wheelCanvas.style.transform = 'rotate(' + this.rotation + 'deg)';
      }
    },
    syncFullscreenState() {
      this.isFullscreen = document.fullscreenElement === this.$refs.fullscreenContainer;
    },
    drawWheel() {
      const canvas = this.$refs.wheelCanvas;
      if (!canvas) {
        return;
      }

      const ctx = canvas.getContext('2d');
      const totalPrizes = this.prizes.length;
      const arc = (2 * Math.PI) / totalPrizes;
      const radius = 300;
      const canvasSize = 600;

      canvas.width = canvasSize;
      canvas.height = canvasSize;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.translate(canvas.width / 2, canvas.height / 2);

      this.prizes.forEach(function(prize, index) {
        const startAngle = index * arc;
        const endAngle = startAngle + arc;

        ctx.beginPath();
        ctx.fillStyle = this.wheelColors[index % this.wheelColors.length];
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();

        ctx.save();
        ctx.rotate(startAngle + arc / 2);
        ctx.fillStyle = '#6f3d2b';
        ctx.font = 'bold 28px Microsoft YaHei';
        ctx.textAlign = 'right';
        ctx.fillText(prize.name, radius - 32, 12);
        ctx.restore();
      }, this);

      ctx.beginPath();
      ctx.fillStyle = '#fffaf0';
      ctx.arc(0, 0, 48, 0, 2 * Math.PI);
      ctx.fill();
    },
    toggleSpin() {
      if (this.spinning) {
        this.stopSpin();
        return;
      }

      this.startSpin();
    },
    startSpin() {
      if (!this.hasRemainingPrizes) {
        window.alert('奖品已抽完');
        return;
      }

      this.result = null;
      this.spinning = true;
      this.clearSpinTimer();

      this.spinTimer = window.setInterval(() => {
        this.rotation += 10;
        if (this.$refs.wheelCanvas) {
          this.$refs.wheelCanvas.style.transform = 'rotate(' + this.rotation + 'deg)';
        }
      }, 16);
    },
    stopSpin() {
      this.clearSpinTimer();
      this.spinning = false;

      let selectedIndex = this.getSelectedIndexFromRotation();
      selectedIndex = this.getNextAvailableIndex(selectedIndex);
      let selectedPrize = this.prizes[selectedIndex];

      this.alignWheelToPrize(selectedIndex);
      selectedPrize.count -= 1;
      this.buildConfetti();
      this.result = selectedPrize.name;
      this.drawWheel();
    },
    clearSpinTimer() {
      if (this.spinTimer) {
        window.clearInterval(this.spinTimer);
        this.spinTimer = null;
      }
    },
    closePopup() {
      this.result = null;
      this.confettiPieces = [];
    },
    buildConfetti() {
      const colors = ['#ffd166', '#f4978e', '#80ed99', '#78c6ff', '#f7b2f8', '#fff3b0'];
      const pieces = [];

      for (let i = 0; i < 42; i += 1) {
        const drift = -120 + Math.random() * 240;
        const spin = 320 + Math.random() * 520;
        pieces.push({
          id: i,
          style: {
            left: (Math.random() * 100).toFixed(2) + '%',
            width: (7 + Math.random() * 7).toFixed(0) + 'px',
            height: (12 + Math.random() * 10).toFixed(0) + 'px',
            backgroundColor: colors[i % colors.length],
            opacity: (0.72 + Math.random() * 0.28).toFixed(2),
            animationDelay: (Math.random() * 0.45).toFixed(2) + 's',
            animationDuration: (2.2 + Math.random() * 1.3).toFixed(2) + 's',
            '--drift': drift.toFixed(0) + 'px',
            '--spin': spin.toFixed(0) + 'deg'
          }
        });
      }

      this.confettiPieces = pieces;
    },
    toggleFullscreen() {
      const container = this.$refs.fullscreenContainer;
      if (!container) {
        return;
      }

      if (document.fullscreenElement === container) {
        document.exitFullscreen();
        return;
      }

      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          if (container.requestFullscreen) {
            container.requestFullscreen();
          }
        });
        return;
      }

      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    }
  }
};
</script>

<style scoped>
.lucky-draw {
  position: relative;
  overflow: hidden;
  min-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  background:
    radial-gradient(circle at 50% 14%, rgba(255, 255, 255, 0.38), transparent 34%),
    radial-gradient(circle at 10% 88%, rgba(255, 233, 187, 0.28), transparent 44%),
    radial-gradient(circle at 90% 82%, rgba(255, 222, 172, 0.22), transparent 40%),
    linear-gradient(180deg, #b24658 0%, #d6766d 28%, #efb08a 60%, #f7dbc2 100%);
  font-family: 'Microsoft YaHei', sans-serif;
  color: #4a2f2f;
}

.mall-bg {
  position: absolute;
  top: -70px;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 245, 214, 0.36), rgba(255, 245, 214, 0.06) 52%, transparent 74%);
  filter: blur(18px);
  z-index: 0;
}

.mall-bg-left {
  left: -170px;
}

.mall-bg-right {
  right: -170px;
}

.mall-spotlight {
  position: absolute;
  top: -30px;
  width: 300px;
  height: 680px;
  background: linear-gradient(180deg, rgba(255, 247, 222, 0.34), rgba(255, 247, 222, 0.08) 35%, transparent 76%);
  clip-path: polygon(50% 0, 100% 0, 68% 100%, 32% 100%, 0 0);
  opacity: 0.55;
  z-index: 0;
}

.mall-spotlight-left {
  left: 10%;
  transform: rotate(-18deg);
}

.mall-spotlight-right {
  right: 10%;
  transform: rotate(18deg);
}

.mall-stage {
  position: absolute;
  bottom: -84px;
  left: 50%;
  width: 980px;
  height: 250px;
  transform: translateX(-50%);
  border-radius: 50%;
  background:
    radial-gradient(circle at center, rgba(255, 245, 219, 0.88) 0, rgba(245, 208, 136, 0.84) 24%, rgba(195, 99, 90, 0.72) 58%, rgba(126, 56, 57, 0.82) 100%);
  box-shadow: 0 -18px 42px rgba(255, 221, 158, 0.18), inset 0 14px 34px rgba(255, 255, 255, 0.18);
  z-index: 0;
}

.mall-marquee {
  position: absolute;
  left: 50%;
  width: 74%;
  height: 12px;
  transform: translateX(-50%);
  border-radius: 999px;
  background:
    radial-gradient(circle, rgba(255, 247, 209, 0.95) 0 3px, transparent 4px) 0 0 / 24px 12px repeat-x,
    linear-gradient(90deg, rgba(241, 195, 112, 0.9), rgba(255, 240, 193, 0.95) 50%, rgba(241, 195, 112, 0.9));
  box-shadow: 0 0 12px rgba(255, 234, 170, 0.42);
  z-index: 1;
}

.mall-marquee-top {
  top: 30px;
}

.mall-marquee-bottom {
  bottom: 28px;
}

.fullscreen-button {
  position: absolute;
  top: 18px;
  right: 18px;
  padding: 10px 18px;
  border: 0;
  border-radius: 999px;
  background: rgba(122, 45, 55, 0.88);
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 8px 18px rgba(36, 41, 46, 0.18);
  z-index: 3;
}

.fullscreen-button:hover {
  background: #8f3c49;
}

.lucky-title {
  margin: 8px 0 18px;
  font-size: 44px;
  line-height: 1;
  letter-spacing: 4px;
  color: #fff8e9;
  text-shadow: 0 6px 16px rgba(118, 50, 46, 0.28), 0 2px 0 rgba(255, 255, 255, 0.22);
  z-index: 2;
}

.lucky-draw:fullscreen {
  min-height: 100vh;
}

.wheel-stage {
  position: relative;
  padding-top: 56px;
  z-index: 2;
}

.pointer {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 36px solid transparent;
  border-right: 36px solid transparent;
  border-top: 72px solid #c94f5c;
  z-index: 2;
  filter: drop-shadow(0 6px 8px rgba(0, 0, 0, 0.18));
}

.wheel {
  width: 600px;
  height: 600px;
  border-radius: 50%;
  border: 10px solid #fff4e0;
  box-shadow: 0 18px 34px rgba(121, 65, 54, 0.24);
  background: #fff;
  transition: transform 0.05s linear;
}

.control-button {
  margin-top: 28px;
  padding: 14px 32px;
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #c74d59, #f09556);
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  box-shadow: 0 12px 24px rgba(117, 40, 47, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.24);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  z-index: 2;
}

.control-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 20px rgba(160, 76, 60, 0.3);
}

.control-button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
  transform: none;
  box-shadow: none;
}

.status-text {
  margin-top: 16px;
  font-size: 16px;
  font-weight: 600;
  color: #fff8eb;
  text-shadow: 0 2px 8px rgba(114, 56, 54, 0.28);
  z-index: 2;
}

.confetti-layer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 28;
}

.confetti-piece {
  position: absolute;
  top: -14vh;
  border-radius: 2px;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.28);
  animation-name: confetti-fall;
  animation-timing-function: cubic-bezier(0.2, 0.85, 0.35, 1);
  animation-fill-mode: forwards;
}

@keyframes confetti-fall {
  0% {
    transform: translate3d(0, -8vh, 0) rotate(0deg);
  }
  100% {
    transform: translate3d(var(--drift), 108vh, 0) rotate(var(--spin));
    opacity: 0;
  }
}

.result-mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(74, 47, 47, 0.28);
  z-index: 30;
}

.result-popup {
  width: 100%;
  max-width: 320px;
  padding: 28px 24px;
  border-radius: 20px;
  background: #fff9f1;
  box-shadow: 0 18px 36px rgba(94, 49, 40, 0.2);
  text-align: center;
  position: relative;
  z-index: 31;
}

.result-popup p {
  margin: 0 0 18px;
  font-size: 20px;
  font-weight: 700;
}

.result-popup button {
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background: #c75a57;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
}

@media (max-width: 480px) {
  .mall-bg {
    width: 260px;
    height: 260px;
  }

  .mall-spotlight {
    width: 180px;
    height: 420px;
  }

  .mall-stage {
    width: 560px;
    height: 150px;
    bottom: -45px;
  }

  .mall-marquee {
    width: 92%;
  }

  .fullscreen-button {
    top: 12px;
    right: 12px;
    padding: 8px 14px;
    font-size: 13px;
  }

  .lucky-title {
    font-size: 30px;
    letter-spacing: 2px;
    margin-top: 4px;
  }

  .wheel {
    width: 320px;
    height: 320px;
  }

  .control-button {
    font-size: 18px;
    padding: 12px 26px;
  }
}
</style>