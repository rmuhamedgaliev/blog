---
title: "Jackson маппинг интерфейсов с объектами"
date: 2022-04-29T23:50:28+03:00
slug: "jackson-polymorphic"
tags: ["java", "jackson"]
categories: ["Development"]
draft: false
---

В ходе разработки приходится из JSON получать обобщенный объект. Например у нас есть JSON из API Telegram.

```json
"old_chat_member": {
    "user": {
        "id": 1900941618,
        "is_bot": true,
        "first_name": "btdd_test",
        "username": "btdd_test_bot"
    },
    "status": "left"
},
"new_chat_member": {
    "user": {
        "id": 1900941618,
        "is_bot": true,
        "first_name": "btdd_test",
        "username": "btdd_test_bot"
    },
    "status": "member"
}
```

Эти объекты похожи, но они могут иметь различные поля внутри, все типы [ChatMember](https://core.telegram.org/bots/api#chatmember) схожи по полю `status`. Логично такой объект иметь как интерфейс, ведь мы не знаем когда и какой [ChatMember](https://core.telegram.org/bots/api#chatmember) придет в JSON. Ведь сейчас тут могут прийти 6 разных объектов:

- [ChatMemberOwner](https://core.telegram.org/bots/api#chatmemberowner)
- [ChatMemberAdministrator](https://core.telegram.org/bots/api#chatmemberadministrator)
- [ChatMemberMember](https://core.telegram.org/bots/api#chatmembermember)
- [ChatMemberRestricted](https://core.telegram.org/bots/api#chatmemberrestricted)
- [ChatMemberLeft](https://core.telegram.org/bots/api#chatmemberleft)
- [ChatMemberBanned](https://core.telegram.org/bots/api#chatmemberbanned)

Логично сделать общий интерфейс ChatMember

```java
public interface ChatMember {
}
```

И сделать для них все реализации. Но если не делать дополнительных настроек, то можем получить ошибку **abstract types either need to be mapped to concrete types, have custom deserializer, or contain additional type information**. Это ошибка говорит нам, что Jackson не знает как сериализовать интерфейс. Для этого нам необходимо воспользоваться аннотацией [JsonTypeInfo](https://fasterxml.github.io/jackson-annotations/javadoc/2.4/com/fasterxml/jackson/annotation/JsonTypeInfo.html) и [JsonSubTypes](https://fasterxml.github.io/jackson-annotations/javadoc/2.4/com/fasterxml/jackson/annotation/JsonSubTypes.html). Конфигурация сериализатора будет выглядеть так

```java
package dev.tobee.telegram.model.chat;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonTypeInfo(
        use: JsonTypeInfo.Id.NAME,
        include: JsonTypeInfo.As.EXISTING_PROPERTY,
        property: "status",
        visible: true
)
@JsonSubTypes({
        @JsonSubTypes.Type(value: ChatMemberOwner.class, name: ChatMemberStatus.Constants.CREATOR),
        @JsonSubTypes.Type(value: ChatMemberAdministrator.class, name: ChatMemberStatus.Constants.ADMINISTRATOR),
        @JsonSubTypes.Type(value: ChatMemberMember.class, name: ChatMemberStatus.Constants.MEMBER),
        @JsonSubTypes.Type(value: ChatMemberRestricted.class, name: ChatMemberStatus.Constants.RESTRICTED),
        @JsonSubTypes.Type(value: ChatMemberLeft.class, name: ChatMemberStatus.Constants.LEFT),
        @JsonSubTypes.Type(value: ChatMemberBanned.class, name: ChatMemberStatus.Constants.KICKED)
})
public interface ChatMember {
    ChatMemberStatus status();
}
```

Таким образом мы говорим, что будем сериализовать интерфейс по полю **status** в JSON и в зависимости что там написано, у нас будут подключаться конкретные реализации этого интерфейса. Детальнее можно посмотреть [тут](https://github.com/rmuhamedgaliev/tbd-telegram/blob/master/src/main/java/dev/tobee/telegram/model/chat/ChatMember.java).

Такой механизм, очень удобно позволяет организовать структуру одинаковых объектов для сериализации.

Надеюсь эта статья помогла вам разобраться с проблемой сериализации интерфейсов.