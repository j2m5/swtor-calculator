import { formatStats, simplifyStats } from '@/helpers'
export default {
  methods: {
    formatStats (item) {
      return formatStats(item)
    },
    simplifyStats (item) {
      return simplifyStats(item)
    }
  }
}
