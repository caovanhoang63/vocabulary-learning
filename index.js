import fs from 'fs';

// Bước 1: Đọc file JSON
const filePath = 'public/health.json'; // Đường dẫn đến file JSON

try {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    let jsonData = JSON.parse(rawData); // Chuyển từ chuỗi sang object
    const vocabularies = jsonData.vocabulary
    for (const vocabulary of vocabularies) {
        await fetch(`https://api.pexels.com/v1/search?query=${vocabulary.word}&per_page=1&locale='en-US'`, {
            headers: {
                "Authorization": ""
            }
        }).then(res => {
            res.json().then(data => {
                console.log(vocabulary.word, data.photos?.[0].src.original);
                vocabulary.image = {
                    width: data.photos?.[0].width,
                    height: data.photos?.[0].height,
                    src: data.photos?.[0].src.small,
                    alt: data.photos?.[0].alt,
                }
            })
        })
    }
    jsonData.vocabulary = vocabularies;

    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf-8');
    console.log('✅ File JSON đã được cập nhật!');
} catch (err) {
    console.error('❌ Lỗi khi xử lý file JSON:', err);
}


