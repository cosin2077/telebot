const listenEvents = [
  "text", "callback_query", "message", "channel_post", "chat_member", "chosen_inline_result", "edited_channel_post", "edited_message", "inline_query", "my_chat_member", "pre_checkout_query", "poll_answer", "poll", "shipping_query", "chat_join_request", "channel_chat_created", "connected_website", "delete_chat_photo", "group_chat_created", "invoice", "left_chat_member", "message_auto_delete_timer_changed", "migrate_from_chat_id", "migrate_to_chat_id", "new_chat_members", "new_chat_photo", "new_chat_title", "passport_data", "proximity_alert_triggered", "pinned_message", "successful_payment", "supergroup_chat_created", "voice_chat_scheduled", "voice_chat_started", "voice_chat_ended", "voice_chat_participants_invited", "forward_date", "animation", "document", "audio", "contact", "dice", "game", "location", "photo", "sticker", "venue", "video", "video_note", "voice"
]

module.exports = {
  listenEvents
}