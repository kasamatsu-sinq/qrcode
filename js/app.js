

const video = document.querySelector('#js-video')
const canvas = document.querySelector('#js-canvas')
const ctx = canvas.getContext('2d')

const checkImage = function(){
	// 取得している動画をCanvasに描画
	ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

	// Canvasからデータを取得
	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

	// jsQRに渡す
	const code = jsQR(imageData.data, canvas.width, canvas.height)

	// QRコードの読み取りに成功したらモーダル開く
	// 失敗したら再度実行
	if (code) {
		openModal(code.data)
	} else {
		setTimeout(function(){ checkImage() }, 200)
	}
}

const openModal = function (url) {
	// document.querySelector(".result_box").innerText = url;
	document.querySelector('#js-result').innerText = url
	document.querySelector('#js-link').setAttribute('href', url)
	document.querySelector('#js-modal').classList.add('is-show')
}

document.querySelector('#js-modal-close')
	.addEventListener('click', function(){
		document.querySelector('#js-modal').classList.remove('is-show')
		setTimeout(function(){
			checkImage();
		},2000);
	})
	
if (!navigator.mediaDevices) {
	document.querySelector('#js-unsupported').classList.add('is-show')
} else {
	navigator.mediaDevices
		.getUserMedia({
			audio: false,
			video: {
				facingMode: {
					exact: 'environment'
				}
			}
		})
		.then(function (stream) {
			video.srcObject = stream
			video.onloadedmetadata = function (e) {
				video.play()
				checkImage()
			}
		})
		.catch(function (err) {
			document.querySelector('#js-unsupported').classList.add('is-show');
			document.querySelector('h1').classList.add('disable');
		})

}

