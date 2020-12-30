import { downloadImgUrl } from '../../utils/wx-utils';
/** 等待绘制图片原型方法 */
export default {
    name: 'drawImage',
    init: (canvas, ctx) => {
        ctx.oldDrawImage = ctx.drawImage;
    },
    handle: async (canvas, ctx, url, dx, dy, dWidth, dHeigt, sx, sy, sWidth, sHeight) => {
        const path = await downloadImgUrl(url);
        ctx.existDrawImage = true;
        let result = false;
        if (ctx.drawType === 'context') {
            ctx.oldDrawImage(path, dx, dy, dWidth, dHeigt, sx, sy, sWidth, sHeight);
            ctx.restore();
            result = true;
        }
        if (ctx.drawType === 'type2d') {
            result = await new Promise(resolve => {
                const image = canvas.createImage();
                image.src = path;
                image.onload = () => {
                    ctx.oldDrawImage(image, dx, dy, dWidth, dHeigt, sx, sy, sWidth, sHeight);
                    ctx.restore();
                    resolve(true);
                };
                image.onerror = () => resolve(false);
            });
        }
        return result;
    }
};
// ctx.drawCoverImage
// ctx.drawCoverRoundImage
// ctx.drawFillImage
// ctx.drawFillRoundImage
// ctx.drawContainImage
// ctx.drawContainRoundImage
// ctx.drawRoundImage
// ctx.drawImage({
//   round: 15,
//   objectFit: 'cover',
//   intrinsicSize: {width: 100, height: 100}, 
//   specifiedSize: {width: 100, height: 100},
//   position: ['left', 'center']
// })
