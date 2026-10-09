import assert from "node:assert/strict";
import test from "node:test";
import { ACTIVITY_TYPES, activityTypeFor, isCommercialActivityType } from "./activity-types";

test("approved activity types route only to their respective categories", () => {
  assert.equal(activityTypeFor("outlook_missing_sent"), ACTIVITY_TYPES.emailSent.id);
  assert.equal(activityTypeFor("outlook_missing_received"), ACTIVITY_TYPES.emailReceived.id);
  assert.equal(activityTypeFor("klaviyo_email_opened"), ACTIVITY_TYPES.klaviyo.id);
  assert.equal(activityTypeFor("klaviyo_email_clicked"), ACTIVITY_TYPES.klaviyo.id);
  assert.equal(activityTypeFor("klaviyo_guide_signup"), ACTIVITY_TYPES.klaviyo.id);
  assert.equal(isCommercialActivityType(ACTIVITY_TYPES.quoteSent.id), true);
  assert.equal(isCommercialActivityType(ACTIVITY_TYPES.other.id), false);
});
