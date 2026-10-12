# Remembered people and causal encounters

The first chapter adds eight optional, bilingual continuations, without choosing a class or requiring one particular chain:

- Sen can receive herbs later after being given directions, or Lin can be asked to help. Calling her produces her own subsequent report.
- Delivering Lin's infusion lets Mei offer a caravan supply commission. The player pays herbs when accepting it and receives payment only from Ho in the city. This receipt does not itself grant city access.
- A defeated White Fang disciple spreads a rumour. Witnesses or an acquainted Wei can resolve it, then the player chooses reconciliation or distance.
- Ren responds to a known pupil's death with safe local recovery work or rest.
- Returning the inscription report to Wei opens a safe investigation at the temple, without unlocking the guardian's seal.

Scene requirements read successful decision IDs; accepting, declining and completing remain separate events. Failed combat never records a successful choice. Optional postponement leaves the meeting available. Successful once-only choices cannot pay again through a stale encounter reference.

The generated 1,080 scene IDs stay unchanged. The same actor ID survives task, obstacle and chapter changes. A person has at most one unfinished generated commission, and a subsequent opener acknowledges previously collected results or refusals. Recognition remains awarded by the original completion scene and attributed to the chapter where the work began. These context reads consume no random numbers, so reloads preserve the seed sequence.

NPC memory is stored in `world.people`, with bounded trust and bounded memories per stable person. World integration records meetings when offered or inspected, outcomes after actual successful actions, and failure before death. UI obtains relationship and memory text through `W.memory.context`; it does not mutate encounters.
