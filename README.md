# news-crawler

Config based news crawler using Google Puppeteer

### Sample News Source Config

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

### Sample News Output Json

```

```
