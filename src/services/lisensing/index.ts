import moment from "moment"
import { hash } from "../../utils"
import { getConfig } from "../database/db"

export interface License {
    license: string
    licenseType?: string
    licenseVersion?: string
    licenseeName: string
    validTill?: Date
}

// check the license and return the license status
async function checkLicense() {
    const confg = await getConfig()

    // if first time, return false
    if (confg.firstTime) {
        // create a trial license
        await CreateTrialLicense()
        return true
    }
    
    // get the license from the database
    const license = confg.lisenseKey
    // if the license is not present, return false
    if (!license) {
        confg.lisenseValid = false
        await confg.save()
        return false
    }

    // if the license is present, check the license type
    const licenseType = confg.lisenseType
    // if the license type is trial, check the validity of the license
    if (licenseType === "trial") {
        const validTill = confg.lisenseValidTill
        // if the license is valid, return true
        if (validTill && moment(validTill).isAfter(moment())) {
            confg.lisenseValid = true
            await confg.save()
            return true
        }
        // if the license is not valid, return false
        confg.lisenseValid = false
        await confg.save()
        return false
    }

    // if the license type is not trial, check the validity of the license
    const validTill = confg.lisenseValidTill
    // if the license is valid, return true
    if (validTill && moment(validTill).isAfter(moment())) {
        confg.lisenseValid = true
        await confg.save()
        return true
    }
    // if the license is not valid, return false
    confg.lisenseValid = false
    await confg.save()
    return false
}

async function CreateTrialLicense() {
    const confg = await getConfig()
    confg.lisenseKey = `trial_${moment().format('YYYYMMDDHHmmss')}_xp_1.0.0`
    confg.lisenseType = "trial"

    confg.lisenseValidationDate = new Date()
    confg.lisenseValidTill = moment().add(2, 'month').toDate()
    confg.lisenseVersion = "1.0.0"
    confg.lisenseeName = "trial"

    confg.lisenseValid = true
    confg.appExpired = false

    confg.firstTime = false

    confg.expiryDate = moment().add(2, 'month').toDate()

    return confg.save()
}

//generate serial key
 function generateSerialKey(): string {
    const chars: string = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const serialLength: number = 16;
    let random: number;

    let result: string = "";
    for (let i: number = 0; i < serialLength; i++) {
        random = Math.floor(Math.random() * chars.length);
        result += chars.substring(random, random + 1);
    }
   
    // add a dash after every 4 characters
    result = result.replace(/(.{4})/g, "$1-").slice(0, -1);
    return result;
}

async function checkLicenseKey(license: string, name: string): Promise<boolean> {
    const confg = await getConfig()
    const serial = confg.serialKey.replace(/-/g, '')
    const date = moment().format('YYYYMMDD');

    // Make the hash key from the serial number and the name
    const hashKey = `${serial}${name}${date}`

    // Hash the key
    const hashVal = await hash(hashKey)

    // Compare the hash to the license
    return hashVal === license
}


async function CreateLicense({
    license,
    licenseType="paid",
    licenseVersion="1.0.0",
    licenseeName,
    validTill = moment().add(5, 'year').toDate()
} : License) {
    const confg = await getConfig()
    confg.lisenseKey = license
    confg.lisenseType = licenseType

    confg.lisenseValidationDate = new Date()
    confg.lisenseValidTill = validTill
    confg.lisenseVersion = licenseVersion
    confg.lisenseeName = licenseeName

    confg.lisenseValid = true
    confg.appExpired = false

    confg.expiryDate = validTill;

    confg.save()

    return {
        license,
        licenseType,
        licenseVersion,
        licenseeName,
        validTill
    }
}

export {
    checkLicense,
    CreateLicense,
    CreateTrialLicense,
    generateSerialKey,
    checkLicenseKey
}

