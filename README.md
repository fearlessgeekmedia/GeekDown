# GeekDown

GeekDown is a desktop markdown editor I created using Milkdown, Crepe, W3.css, and Electron.&#x20;

<br />

I wanted to get a little more experience with Milkdown before adding it to FearlessCMS.&#x20;

<br />

Right now, I only have this working in Linux - MX Linux specifically. I have also run it on MacOS Sequoia x85. I don't have Windows. This is alpha software at this time.

<br />

**Known issues:** Save only saves to the editor itself. It does not save to the actual file. This will be renamed in the next release. Use Save As to save your file.

<br />

If you download the source, do the following.

**Linux and MacOS**

```
npm install @milkdown/crepe electron electron-builder vite --save-dev
```

To test

```
npm run electron:dev
```

To build

```
npm run electron:build
```

An AppImage will be in the electron-dist directory. Enjoy!

<br />

This README file was created and edited in GeekDown!

<br />

If you want to financially support this and other projects of mine, you may do so at <https://ko-fi.com/fearlessgeekmedia>

<br />
