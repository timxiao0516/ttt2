/*
MoveNet Skeleton - Steve's Makerspace (大部分代碼來自 TensorFlow)
留言

MoveNet 由 TensorFlow 開發:
https://www.tensorflow.org/hub/tutorials/movenet
*/
let video, bodypose, pose, keypoint, detector; // 定義變量
let poses = [];
let img; // 用於存放您的物件圖片
let studentID = "412730987"; // 學號
let studentName = "蕭詠錠"; // 姓名

// 定義物件圖片位置和速度
let leftEyeX, leftEyeY, rightEyeX, rightEyeY;
let leftEyeSpeed = 2;
let rightEyeSpeed = 2;
let leftWristX, leftWristY, rightWristX, rightWristY;
let leftWristSpeed = 2;
let rightWristSpeed = 2;

// 初始化MoveNet檢測器
async function init() {
    const detectorConfig = {
        modelType: poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING,
    };
    detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        detectorConfig
    );
}

// 當視頻準備好時調用
async function videoReady() {
    console.log("video ready");
    await getPoses();
}

// 獲取姿勢數據
async function getPoses() {
    if (detector) {
        poses = await detector.estimatePoses(video.elt, {
            maxPoses: 2,
            //flipHorizontal: true,
        });
    }
    requestAnimationFrame(getPoses);
}

// 設置畫布和視頻
async function setup() {
    createCanvas(640, 480); // 創建畫布
    video = createCapture(VIDEO, videoReady); // 捕捉視頻
    video.size(width, height); // 設置視頻尺寸
    video.hide(); // 隱藏視頻元素
    await init(); // 初始化檢測器

    img = loadImage('upload_f887fd0cb29f9d086fb4d63b754f6d79.gif'); // 加載您的物件圖片

    stroke(255); // 設置筆觸顏色為白色
    strokeWeight(5); // 設置筆觸寬度為5
}

// 繪製每一幀
function draw() {
    image(video, 0, 0); // 繪製視頻到畫布上
    drawSkeleton(); // 繪製骨架

    // 水平翻轉圖像
    let cam = get();
    translate(cam.width, 0);
    scale(-1, 1);
    image(cam, 0, 0);
}

// 繪製骨架
function drawSkeleton() {
    for (let i = 0; i < poses.length; i++) {
        pose = poses[i];

        // 繪製肩膀到手腕的線條
        for (let j = 5; j < 9; j++) {
            if (pose.keypoints[j].score > 0.1 && pose.keypoints[j + 2].score > 0.1) {
                let partA = pose.keypoints[j];
                let partB = pose.keypoints[j + 2];
                line(partA.x, partA.y, partB.x, partB.y); // 繪製線條
            }
        }

        // 繪製肩膀到肩膀的線條
        let partA = pose.keypoints[5];
        let partB = pose.keypoints[6];
        if (partA.score > 0.1 && partB.score > 0.1) {
            line(partA.x, partA.y, partB.x, partB.y); // 繪製線條
        }

        // 繪製髖部到髖部的線條
        partA = pose.keypoints[11];
        partB = pose.keypoints[12];
        if (partA.score > 0.1 && partB.score > 0.1) {
            line(partA.x, partA.y, partB.x, partB.y); // 繪製線條
        }

        // 繪製肩膀到髖部的線條
        partA = pose.keypoints[5];
        partB = pose.keypoints[11];
        if (partA.score > 0.1 && partB.score > 0.1) {
            line(partA.x, partA.y, partB.x, partB.y); // 繪製線條
        }
        partA = pose.keypoints[6];
        partB = pose.keypoints[12];
        if (partA.score > 0.1 && partB.score > 0.1) {
            line(partA.x, partA.y, partB.x, partB.y); // 繪製線條
        }

        // 繪製髖部到腳部的線條
        for (let j = 11; j < 15; j++) {
            if (pose.keypoints[j].score > 0.1 && pose.keypoints[j + 2].score > 0.1) {
                partA = pose.keypoints[j];
                partB = pose.keypoints[j + 2];
                line(partA.x, partA.y, partB.x, partB.y); // 繪製線條
            }
        }

        // 在眼睛位置繪製物件圖片，並從左往右移動
        let leftEye = pose.keypoints[1];
        let rightEye = pose.keypoints[2];
        if (leftEye.score > 0.1) {
            if (leftEyeX === undefined) {
                leftEyeX = leftEye.x; // 初始化左眼位置
                leftEyeY = leftEye.y;
            } else {
                leftEyeX += leftEyeSpeed;
                if (leftEyeX > width) {
                    leftEyeX = -25; // 重置位置
                }
            }
            image(img, leftEyeX - 25, leftEyeY - 25, 50, 50); // 繪製圖片
        }
        if (rightEye.score > 0.1) {
            if (rightEyeX === undefined) {
                rightEyeX = rightEye.x; // 初始化右眼位置
                rightEyeY = rightEye.y;
            } else {
                rightEyeX += rightEyeSpeed;
                if (rightEyeX > width) {
                    rightEyeX = -25; // 重置位置
                }
            }
            image(img, rightEyeX - 25, rightEyeY - 25, 50, 50); // 繪製圖片
        }

        // 在手腕位置繪製物件圖片，並從右往左移動
        let leftWrist = pose.keypoints[9];
        let rightWrist = pose.keypoints[10];
        if (leftWrist.score > 0.1) {
            if (leftWristX === undefined) {
                leftWristX = leftWrist.x; // 初始化左手腕位置
                leftWristY = leftWrist.y;
            } else {
                leftWristX -= leftWristSpeed;
                if (leftWristX < -25) {
                    leftWristX = width; // 重置位置
                }
            }
            image(img, leftWristX - 25, leftWristY - 25, 50, 50); // 繪製圖片
        }
        if (rightWrist.score > 0.1) {
            if (rightWristX === undefined) {
                rightWristX = rightWrist.x; // 初始化右手腕位置
                rightWristY = rightWrist.y;
            } else {
                rightWristX -= rightWristSpeed;
                if (rightWristX < -25) {
                    rightWristX = width; // 重置位置
                }
            }
            image(img, rightWristX - 25, rightWristY - 25, 50, 50); // 繪製圖片
        }

        // 在頭頂上方顯示學號和姓名
        let nose = pose.keypoints[0];
        if (nose.score > 0.1) {
            fill(255, 0, 0); // 設置填充顏色為紅色
            textSize(20); // 設置文字大小為20
            textAlign(CENTER); // 設置文字對齊方式為中心對齊
            text(`${studentID} ${studentName}`, nose.x, nose.y - 50); // 顯示學號和姓名
        }
    }
}
