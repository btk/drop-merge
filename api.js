import { AsyncStorage } from 'react-native';
import Storage from 'react-native-storage';
import { Analytics, ScreenHit, Event as Avent } from 'expo-analytics-safe';
import { Audio } from 'expo-av';

let storage = new Storage({
	size: 1000,
	storageBackend: AsyncStorage,
	defaultExpires: null,
	enableCache: true,
	sync: {}
});


class Api {
  constructor(){
		this.analytics = new Analytics('UA-150362294-1', {slug: "pvo", name: "pvo", version: this.version});
		this.preloadSounds();
  }

	hit(page){
		this.analytics.hit(new ScreenHit(page))
			.then(() => console.log("success"))
			.catch(e => console.log(e.message));
	}

	analyticsEvent(category, type, label, value){
		this.analytics.event(new Avent(category, type, label, value))
		  .then(() => console.log("success"))
		  .catch(e => console.log(e.message));
	}

	async preloadSounds(){
		this.sounds = [];
		let sound1 = new Audio.Sound();
		sound1.loadAsync(require('./assets/sound/a1.mp3'));
		this.sounds.push(sound1);

		let sound2 = new Audio.Sound();
		sound2.loadAsync(require('./assets/sound/a2.mp3'));
		this.sounds.push(sound2);

		let sound3 = new Audio.Sound();
		sound3.loadAsync(require('./assets/sound/a3.mp3'));
		this.sounds.push(sound3);

		let sound4 = new Audio.Sound();
		sound4.loadAsync(require('./assets/sound/a4.mp3'));
		this.sounds.push(sound4);

		let sound5 = new Audio.Sound();
		sound5.loadAsync(require('./assets/sound/a5.mp3'));
		this.sounds.push(sound5);
	}

	async sound(i){
		await this.sounds[i].setPositionAsync(0);
		await this.sounds[i].playAsync();
	}

  setData(key, data){
		return storage.save({key, data});
  }

  async getData(key){
    // returns promise
		try {
			return await storage.load({key});
		} catch (error) {
			return "";
		}
  }
}

const _api = new Api();
export default _api;
