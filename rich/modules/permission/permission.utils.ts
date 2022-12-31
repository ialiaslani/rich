

export class PermissionUtils {


        serializePermission(permission: string): string {

                //SERIALIZE PERMISSION STRING
                let permissionString = permission.replace('/api', '').replace('/:id', '')
                if (permissionString.startsWith('/'))
                        permissionString = permissionString.substring(1)
                permissionString = permissionString.replace(/[/]/g, '.')

                if (permissionString.split(".").length !== 4) {
                        throw new Error("Wrong Route Structure! Not Matching Pattern [scope].[microservice].[module].[action]")
                }

                return permissionString
        }

        comparePermission(permission: string, pattern: string) {

                //INITIALIZE
                const permissionChars = permission.split('')
                const patternChars = pattern.split('')
                const permissionLength = permissionChars.length
                const patternLength = patternChars.length

                let permissionPointer = 0
                let patternPointer = 0

                while (true) {
                        //POINT TO CHARECTERS
                        let permissionChar = permissionChars[permissionPointer]
                        let patternChar = patternChars[patternPointer]

                        //IF CHARECTERS ARE EQUAL
                        if (permissionChar === patternChar) {
                                permissionPointer++
                                patternPointer++

                                //IF SERIALIZED PERMISSION AND PATTERN ARE OVER
                                if (
                                        permissionPointer >= permissionLength &&
                                        patternPointer >= patternLength
                                )
                                        return true
                                //IF SERIALIZED PERMISSION OR PATTERN ARE OVER
                                else if (
                                        permissionPointer >= permissionLength ||
                                        patternPointer >= patternLength
                                )
                                        return false
                                continue
                        }

                        //IF PATTERN DOSEN'T MATCH ALL
                        if (patternChar !== '*') return false

                        patternPointer += 2

                        //GO TO NEXT WORD
                        do {
                                //IF THERE IS NO OTHER WORD
                                if (permissionLength <= permissionPointer) return true
                        } while (permissionChar[permissionPointer++] !== '.')
                }

        }

        generatePermission(allRoutes: string[], selectedRoutes: string[]) {

                for (const selectedRoute of selectedRoutes) {
                        if (!allRoutes.includes(selectedRoute)) {
                                throw new Error("Provided Route " + selectedRoute + " Doesn't Exist!")
                        }
                }

                let patterns = []
                let hasOnes = [false, false, false, false]

                const mainPermissions = allRoutes.map(r => this.serializePermission(r))
                const selectedPermissions = selectedRoutes.map(r => this.serializePermission(r))

                const indexes = [0, 1, 2, 3]

                const mainParts = indexes.map(i => [...new Set(mainPermissions.map(m => this.mapPermissions(i, m)))])

                const selectedParts = indexes.map(i => selectedPermissions.map(s => this.mapPermissions(i, s)))


                for (const i of indexes) {

                        hasOnes[i] = !mainParts[i].map(s => selectedParts[i].includes(s)).includes(false)

                }


                for (const selectedPermission of selectedPermissions) {

                        let pattern = ""

                        for (const i of indexes) {

                                const part = selectedPermission.split(".")[i]
                                if (hasOnes[i]) {
                                        pattern += "*"
                                } else {
                                        pattern += part
                                }

                                if (i !== 3) {
                                        pattern += "."
                                }
                        }

                        patterns.push(pattern)
                }



                return patterns
        }

        mapPermissions(i, m) {
                if (i === 0)
                        return m.split(".")[i]
                else if (i === 1)
                        return m.split(".")[i] + "." + m.split(".")[i - 1]
                else if (i === 2)
                        return m.split(".")[i] + "." + m.split(".")[i - 1] + "." + m.split(".")[i - 2]
                else return m
        }




}