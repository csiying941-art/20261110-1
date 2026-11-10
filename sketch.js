// 宣告全域變數用於儲存精靈圖片資源
let stopSprite;                                   // 儲存站立精靈圖片 (1/stop/stop.png)
let walkSprite;                                   // 儲存走路精靈圖片 (1/walk/walk.png)[cite: 12]
let pushSprite;                                   // 儲存攻擊推送精靈圖片 (1/push/push.png)
let effectSprite;                                 // 儲存攻擊特效精靈圖片 (1/to/to.png)

// 站立精靈相關參數
let stopTotalWidth = 1255;                        // 站立精靈圖集總寬度
let stopTotalFrames = 9;                          // 站立精靈總格數（前9格循環）
let stopFrameW = stopTotalWidth / 9;              // 站立單格寬度
let stopFrameH = 196;                             // 站立單格高度 196 像素
let stopCurrentFrame = 0;                         // 站立動畫影格計數器
let stopSpeed = 0.15;                             // 站立動畫播放速度

// 走路精靈相關參數
let walkTotalWidth = 1246;                        // 走路精靈圖集總寬度 (1246)[cite: 12]
let walkTotalFrames = 9;                          // 走路精靈總格數 (9張)[cite: 12]
let walkFrameW = walkTotalWidth / walkTotalFrames;// 走路單格寬度 (約 138.44 像素)[cite: 12]
let walkFrameH = 198;                             // 走路單格高度 198 像素[cite: 12]
let walkCurrentFrame = 0;                         // 走路動畫影格計數器
let walkSpeed = 0.2;                              // 走路動畫播放速度

// 攻擊推送精靈相關參數
let pushTotalWidth = 1039;                        // 攻擊精靈圖集總寬度 (1039)
let pushTotalFrames = 4;                          // 攻擊精靈總格數 (4張)
let pushFrameW = pushTotalWidth / pushTotalFrames;// 攻擊單格寬度 (約 259.75 像素)
let pushFrameH = 146;                             // 攻擊單格高度 146 像素
let pushCurrentFrame = 0;                         // 攻擊動畫影格計數器
let pushSpeed = 0.2;                              // 攻擊動畫播放速度
let isPushing = false;                            // 布林變數：記錄目前是否正在執行攻擊動畫

// 攻擊特效精靈相關參數 (1/to/to.png)
let effectTotalWidth = 740;                       // 特效精靈圖集總寬度 (740)
let effectTotalFrames = 5;                        // 特效精靈總格數 (5張)
let effectFrameW = effectTotalWidth / effectTotalFrames; // 特效單格寬度 (148 像素)
let effectFrameH = 19;                            // 特效單格高度 19 像素

// 角色位置與移動控制變數
let posX;                                         // 角色在畫布中的 X 座標
let posY;                                         // 角色在畫布中的 Y 座標
let moveSpeed = 4;                                // 角色移動速度像素值
let direction = 1;                                // 角色朝向：1 表示面向右方，-1 表示面向左方

// p5.js 預載函數：在畫布建立前載入所有圖片資源
function preload() {
  stopSprite = loadImage('1/stop/stop.png');      // 載入站立圖片精靈檔案
  walkSprite = loadImage('1/walk/walk.png');      // 載入走路圖片精靈檔案[cite: 12]
  pushSprite = loadImage('1/push/push.png');      // 載入攻擊推送圖片精靈檔案
  effectSprite = loadImage('1/to/to.png');        // 載入攻擊特效圖片精靈檔案
}

// p5.js 設定函數：初始化畫布與角色初始位置
function setup() {
  createCanvas(windowWidth, windowHeight);        // 建立填滿瀏覽器的全螢幕畫布
  imageMode(CENTER);                              // 將圖片繪製基準點設為中心，方便翻轉與定位
  posX = (width * 2) / 3;                         // 初始位置設定在視窗 X 軸的 2/3 處
  posY = height - stopFrameH / 2;                 // 初始位置設定在畫面最底端
}

// p5.js 繪製函數：每秒執行多次以更新畫面與互動狀態
function draw() {
  // 設定背景顏色為天空藍色
  background(135, 206, 235);

  // 宣告一個旗標來判斷當前是否正在移動
  let isMoving = false;

  // 如果目前沒有在放攻擊動畫，才允許偵測左右移動
  if (!isPushing) {
    // 檢查是否按住鍵盤左鍵
    if (keyIsDown(LEFT_ARROW)) {
      posX -= moveSpeed;                          // 角色向左移動
      direction = -1;                             // 設定角色朝向左方
      isMoving = true;                            // 標記為移動狀態
    }

    // 檢查是否按住鍵盤右鍵
    if (keyIsDown(RIGHT_ARROW)) {
      posX += moveSpeed;                          // 角色向右移動
      direction = 1;                              // 設定角色朝向右方
      isMoving = true;                            // 標記為移動狀態
    }
  }

  // 決定當前動作狀態的高度與寬度以便限制邊界
  let currentFrameH = stopFrameH;
  let currentFrameW = stopFrameW;
  if (isPushing) {
    currentFrameH = pushFrameH;
    currentFrameW = pushFrameW;
  } else if (isMoving) {
    currentFrameH = walkFrameH;
    currentFrameW = walkFrameW;
  }

  // 限制角色不能超出畫布左右邊界
  let halfW = currentFrameW / 2;
  if (posX < halfW) {
    posX = halfW;                                 // 貼齊左端停止移動
  } else if (posX > width - halfW) {
    posX = width - halfW;                         // 貼齊右端停止移動
  }

  // 使用 push() 與 pop() 隔離畫布狀態，以便進行左右翻轉
  push();
  translate(posX, posY);                          // 將原點移至角色中心點
  scale(direction, 1);                            // 根據 direction 進行水平翻轉

  // 狀態優先權：攻擊中 > 移動中 > 靜止站立
  if (isPushing) {
    // 播放攻擊角色動畫
    pushCurrentFrame += pushSpeed;                // 累加攻擊影格計數器
    let frameIndex = Math.floor(pushCurrentFrame);

    // 檢查是否播放完 4 張角色動作圖
    if (frameIndex >= pushTotalFrames) {
      isPushing = false;                          // 結束攻擊狀態，恢復正常
      pushCurrentFrame = 0;                       // 歸零計數器
      frameIndex = 0;
    }

    let sx = Math.round(frameIndex * pushFrameW);
    // 繪製攻擊角色精靈圖
    image(pushSprite, 0, 0, pushFrameW, pushFrameH, sx, 0, pushFrameW, pushFrameH);

    // 繪製攻擊特效動畫 (to.png)
    // 根據角色的攻擊進度對應特效的 5 張圖 (0 到 4)
    let effectIndex = Math.floor((pushCurrentFrame / pushTotalFrames) * effectTotalFrames);
    if (effectIndex >= effectTotalFrames) {
      effectIndex = effectTotalFrames - 1;
    }
    let effectSx = Math.round(effectIndex * effectFrameW);
    
    // 將特效繪製在角色正前方（X軸偏移 80 像素，Y軸稍微偏上手臂位置）
    image(effectSprite, 80, -10, effectFrameW, effectFrameH, effectSx, 0, effectFrameW, effectFrameH);

  } else if (isMoving) {
    // 播放走路動畫
    walkCurrentFrame += walkSpeed;
    let frameIndex = Math.floor(walkCurrentFrame) % walkTotalFrames;
    let sx = Math.round(frameIndex * walkFrameW);

    // 繪製走路精靈圖
    image(walkSprite, 0, 0, walkFrameW, walkFrameH, sx, 0, walkFrameW, walkFrameH);

  } else {
    // 靜止站立動畫
    stopCurrentFrame += stopSpeed;
    let frameIndex = Math.floor(stopCurrentFrame) % stopTotalFrames;
    let sx = Math.round(frameIndex * stopFrameW);

    // 繪製站立精靈圖
    image(stopSprite, 0, 0, stopFrameW, stopFrameH, sx, 0, stopFrameW, stopFrameH);
  }

  pop();                                          // 恢復畫布原始狀態
}

// 當按下鍵盤按鍵時觸發的事件函數
function keyPressed() {
  // 檢查是否按下空白鍵 (32 代表空白鍵 keyCode，或使用 key === ' ')，且目前不在攻擊中
  if ((key === ' ' || keyCode === 32) && !isPushing) {
    isPushing = true;                             // 啟動攻擊狀態
    pushCurrentFrame = 0;                         // 確保每次按下都是從頭開始播放
  }
}

// 當瀏覽器視窗大小改變時自動觸發調整畫布
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}