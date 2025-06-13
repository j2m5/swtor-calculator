import { hasModifications } from '@/helpers'
export default {
  methods: {
    hasModifications (item) {
      return hasModifications(item)
    }
  }
}
