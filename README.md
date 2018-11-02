Установить NODE.js


Установить глобально:

npm i -g gulp

Команды для запуска
|
npm i			=	(Устанавливаем модули npm)			|
|
gulp			=	(Запуск gulp + livereload)			|
|
gulp build		=	(Сборка проекта в папку "dist")			|
|
gulp clearcache		=	(Удаление кеша после сжатия изображений)	|
|

В корне проекта удалить папку node_modules вводим в коммандной строке	=	rimraf node_modules

Основные папки и файлы:
app _
     | - css
     | - img
     | - js
     | - libs
     | - sass



gulpfile.js	=	настройки сборщика

package.json	=	модули для скачивания

REAME.txt	=	шпаргалка по файлам и запуску
