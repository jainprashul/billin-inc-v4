import moment from "moment"
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
    CreateTrialLicense
}

