# Back-End

## Getting Started

#### Cloning the Repo
```git clone https://github.com/Software-Projects-1/Back-End```

#### Install All Dependencies
```npm install```

#### Current List of Dependencies
 * [Gulp](https://gulpjs.com/)
   * Used for building the app.
 * [Mocha](https://mochajs.org/)
   * Used for unit tests
 * <i>More will be added later</i>

---

## Testing

### Build the app
```npm run-script build```

### Start The App
```npm start```

<i>Add More Later</i>

---

## Building To Heroku

### Setup Heroku
Use [this guide](https://devcenter.heroku.com/articles/getting-started-with-nodejs?singlepage=true) to build the app to Heroku. If you have not been added to the project send a message in Slack and someone will add you.

<i>Will add more here later as I figure out how to deploy to Heroku</i>

Looks like Heroku allows for auto builds. Still install the app just in case it does not work. But I will do research and test it. -Dean


---

## Notes
#### Folder Structure
```
base_folder/
|---build/
    |---www/
    |---server/
|---src/
    |---www/
    |---server/
```

When building the app, Gulp will put the correct files in the correct directory. All code should be written inside the `src/` folder. `build/` is only modified when running gulp