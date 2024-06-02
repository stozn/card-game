from PIL import Image
import os

def split_image(image_path, rows, cols):
    # 打开图片
    try:
        img = Image.open(image_path)
    except:
        print("无法打开图片！")
        return
    
    # 获取图片尺寸
    width, height = img.size
    
    # 计算子图片的宽度和高度
    cell_width = width // cols
    cell_height = height // rows
    
    # 确保输出目录存在
    output_dir = os.path.splitext(image_path)[0]
    os.makedirs(output_dir, exist_ok=True)
    
    # 切分图片并保存
    i = 1
    for row in range(rows):
        for col in range(cols):
            # 计算当前子图片的位置
            x1 = col * cell_width
            y1 = row * cell_height
            x2 = x1 + cell_width
            y2 = y1 + cell_height
            
            # 切分图片
            cell_img = img.crop((x1, y1, x2, y2))
            
            # 保存子图片
            cell_img.save(os.path.join(output_dir, f"{i}.jpg"))
            i += 1

    print(f"图片成功切分成 {rows} 行 {cols} 列，并保存在 {output_dir} 目录中！")

if __name__ == "__main__":
    split_image('artifact.jpg', 3, 2)
    split_image('disaster.jpg', 3, 2)
    split_image('gem.jpg', 2, 2)
