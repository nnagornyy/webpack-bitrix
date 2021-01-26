
## Описание
Данный сборщик работает по приницпу множетсвенных  entrypoin. Он автоматически проходиться по текущей папке (local)
в поисках папок src. Все найденые папки в которых есть входные файлы script и style он собирает, результат сборки 
он кладет выше на 1 уровень. Пример : 
/local/components/test/templates/.default/src/script.ts >> /local/components/test/templates/.default/script.js
/local/components/test/templates/.default/src/style.scss >> /local/components/test/templates/.default/style.css

Таким образом мы получаем на выходе два файла которые автоматически подключаются в шаблонах компонентов битрикс,
при этом мы используем всю мощь современного стека для разработки. TypeScript, ES6, SASS. Less, Styles. 
Импорт зависимостей, обработка статики с добавлением contenthash

## Установка
Содержимое репозитория нужно разместить в папке local, выполнить команду yarn для установки всех зависимостей
В шаблоне сайта необходимо подключить 3 файла

файл header.php
```
use Bitrix\Main\Page\Asset;
Asset::getInstance()->addJs('/local/runtime/script.js');
Asset::getInstance()->addJs('/local/vendors/script.js');
Asset::getInstance()->addCss(SITE_TEMPLATE_PATH.'/style.css');
```

## Начало работы

1. В нужной папке шаблона сайта или компонента создать дериктори /src 
2. Создать два глваный файла (если требутся) script(.js, .ts) , style(.css, .scss, .less, .styl)
3. yarn watch
4. Наслаждаться

## Установка зависимостей

Так как файлы вебапа находяться в корне папки local. Нам для установки зависимости для свеого проекта нужно следующие: 
1. cd local
2. yarn add axios
3. в файле src/script.js импортировать модуль "import axios from 'axios'"


## Общие файлы проекта
Сборка поддерживает алиас @ для папки /local/src/. Там рекомендуется храниться статику и пошареные компоненты vue или подобно
Для файлов стилей испольуется подключение такого вида `background: url("~@/img/summer.png")`
Для JS `import @js/awesome.js`

В сборке присутсвует file-loader который обрабатывает статику. Все файлы он положит в папку /local/assets/ и добавит contenthash в имя файла
