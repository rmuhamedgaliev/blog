---
title: "Pocket"
date: 2023-01-11T01:00:37+03:00
draft: false
---

Если вы любите сервис [Pocket](https://getpocket.com), но вам неудобно читать в узком формте ваши статьи 

![pocket_orig](/images/pocket_orig.png)

Я же вам предлогаю сделать использование сервиса более комфортным. Для этого просто установите расширение [Stylus](https://add0n.com/stylus.html) и установите стиль - [https://userstyles.world/style/8036/getpocket-com-1-9-2023-11-52-20-pm](https://userstyles.world/style/8036/getpocket-com-1-9-2023-11-52-20-pm).

И текст растянется по ширине и применится шрифт [Vollkorn](https://fonts.google.com/specimen/Vollkorn).

В итоге все будет выглядеть так. В расширении применяется простая замена стиля CSS.

```
@-moz-document domain("getpocket.com") {
    article.reader {
        max-width: 100% !important;
        font-size: 30px !important;
        font-family: "Vollkorn" !important;
    }
}
```

![pocket_new](/images/pocket_new.png)

