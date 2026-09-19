import { $n, $t, $c, $a, $cl, on, randInt, hide, show } from '../util.js'
import { G } from '../model/game.js'
import { store } from '../model/store.js'

export const pitch = {
  cancelOne: (dice,result) => {
    return result--;
  }
}