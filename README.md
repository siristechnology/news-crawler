# news-crawler [beta]

Config based news crawler using Google Puppeteer

-   Uses `puppeteer-extra-plugin-adblocker` to block ads
-   Uses `puppeteer-extra-plugin-stealth` to prevent detection
-   Uses `html-to-text` to convert html to text

## Install

    yarn add news-crawler

## Sample News Source Config

```
[
    {
        "name": "ekantipur",
        "pages": [
            {
                "url": "https://ekantipur.com",
                "category": "headlines",
                "link-selector": "article.normal > h1 > a"
            },
            {
                "url": "https://ekantipur.com/sports",
                "category": "sports",
                "link-selector": "#wrapper > main > section article > div.teaser > a"
            }
        ],
        "article-detail-selectors": {
            "title": "main > article > header > h1",
            "excerpt": "article .text-wrap > h2",
            "lead-image": "#wrapper main article header figure img",
            "content": [
                "main article div.text-wrap p.description"
            ],
            "tags": "",
            "likes-count": "main > article > header div.total.shareTotal"
        }
    }
]
```

## Sample News Output Json

```
[
    {
        source: 'ekantipur',
        category: 'sports',
        url: 'https://ekantipur.com/sports/2020/06/11/159183662731487753.html',
        title: 'बायर्न जर्मनकप फाइनलमा',
        leadImage: 'https://assets-cdn-usae.kantipurdaily.com/uploads/source/news/kantipur/2020/third-party/bayern-1162020024916-1000x0.jpg',
        content: 'म्युनिख — बायर्न म्युनिखले कप डबलको उपलब्धि जीवन्त राख्न बुधबार राति आइनट्राख्ट फ्रान्कफर्टलाई २–१ ले हरायो र जर्मनकपको फाइनल'
    }
]
```
