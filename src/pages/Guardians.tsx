import { useMemo, useState } from "react"
import { emergencyContacts, getGuardiansForUser, mapPoints } from "../data/mock"
import {
  CommunityTrustBanner,
  CoverageReadinessPanel,
  EmergencyContactsPanel,
  EmptyHint,
  GuardianActivityPanel,
  GuardianCard,
  GuardianSearchTabs,
  GuardiansHeader,
  GuardianStatsGrid,
  ProtectedMembersPanel,
  ProtectedUserPicker,
} from "../components/guardians/GuardiansPageParts"

const tabs = ["My Guardians", "Protected Members", "Support Network"] as const

function matchesQuery(q: string, fields: (string | undefined)[]) {
  const needle = q.trim().toLowerCase()
  if (!needle) return true
  return fields.some((f) => f?.toLowerCase().includes(needle))
}

export function Guardians() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("My Guardians")
  const [q, setQ] = useState("")
  const [selectedUserId, setSelectedUserId] = useState(mapPoints[0]?.id ?? "p1")

  const selectedUser = mapPoints.find((p) => p.id === selectedUserId) ?? mapPoints[0]
  const userGuardians = useMemo(
    () => getGuardiansForUser(selectedUserId),
    [selectedUserId],
  )

  const filteredGuardians = useMemo(
    () =>
      userGuardians.filter((g) =>
        matchesQuery(q, [g.name, g.relation, g.phone, g.role, g.status]),
      ),
    [q, userGuardians],
  )

  const filteredContacts = useMemo(
    () =>
      emergencyContacts.filter((c) =>
        matchesQuery(q, [c.name, c.relation, c.phone, c.category]),
      ),
    [q],
  )

  const onAddGuardian = () => {
    window.alert(
      `Add Guardian for ${selectedUser?.label ?? "this user"} will open the invite flow when connected.`,
    )
  }

  const onAddContact = () => {
    window.alert(
      "Add Contact will open the support-network form when connected. Existing emergency contacts are unchanged.",
    )
  }

  return (
    <div className="f2s-guardians-page">
      <GuardiansHeader onAdd={onAddGuardian} />
      <GuardianSearchTabs q={q} onQuery={setQ} tab={tab} onTab={setTab} />

      {tab === "My Guardians" && (
        <>
          <ProtectedUserPicker selectedId={selectedUserId} onSelect={setSelectedUserId} />

          <div className="f2s-g-selected-user">
            <p>
              Guardians for <strong>{selectedUser?.label}</strong>
              <span> · User {mapPoints.findIndex((p) => p.id === selectedUserId) + 1}</span>
            </p>
            <em>{userGuardians.length} assigned</em>
          </div>

          <GuardianStatsGrid userId={selectedUserId} />

          <div className="f2s-g-guardian-grid">
            {filteredGuardians.length === 0 ? (
              <EmptyHint>No guardians match your search for this user.</EmptyHint>
            ) : (
              filteredGuardians.map((g) => <GuardianCard key={`${selectedUserId}-${g.id}`} guardian={g} />)
            )}
          </div>

          <div className="f2s-g-bottom">
            <EmergencyContactsPanel contacts={filteredContacts} onAdd={onAddContact} />
            <GuardianActivityPanel />
            <CoverageReadinessPanel userId={selectedUserId} />
          </div>

          <CommunityTrustBanner />
        </>
      )}

      {tab === "Protected Members" && <ProtectedMembersPanel query={q} />}

      {tab === "Support Network" && (
        <div className="f2s-g-support">
          <EmergencyContactsPanel contacts={filteredContacts} onAdd={onAddContact} />
          {filteredContacts.length === 0 ? (
            <EmptyHint>No support contacts match your search.</EmptyHint>
          ) : null}
        </div>
      )}
    </div>
  )
}
